import type { CivicProject } from "@/lib/registry/schemas";

export type CommunityMetric = {
  id: string;
  label: string;
  value: string;
  definition: string;
  timeWindow: string;
  source: string;
  limitation: string;
};

/** Returns transparent, non-ranking community metrics from committed project data and snapshots. */
export function calculateCommunityMetrics(projects: CivicProject[]): CommunityMetric[] {
  const realProjects = projects.filter((project) => !project.demo);
  const activeProjects = realProjects.filter((project) =>
    ["discovery", "prototype", "pilot", "maintained", "needs-maintainer"].includes(project.status),
  );
  const seekingMaintainers = realProjects.filter(
    (project) =>
      project.status === "needs-maintainer" ||
      project.stewardship.indicators.includes("Seeking co-maintainer"),
  );
  const starterTasks = activeProjects
    .flatMap((project) => project.tasks)
    .filter((task) => task.difficulty === "starter");
  const tracks = new Set(
    activeProjects.flatMap((project) => project.contributionTracks.map((track) => track.track)),
  );
  const twoMaintainers = activeProjects.filter(
    (project) =>
      project.maintainers.filter((maintainer) => maintainer.availability === "available").length >=
      2,
  );
  return [
    metric(
      "active-projects",
      "Active projects",
      activeProjects.length,
      "Projects in Discovery, Prototype, Pilot, Maintained, or Needs maintainer stages.",
      "Current committed registry",
      "registry/projects",
      "Does not measure how valuable, busy, or healthy a project is.",
    ),
    metric(
      "seeking-maintainers",
      "Projects seeking maintainers",
      seekingMaintainers.length,
      "Non-demo projects marked Needs maintainer or explicitly seeking a co-maintainer.",
      "Current committed registry",
      "registry/projects",
      "A project can be useful even if it is seeking stewardship.",
    ),
    metric(
      "beginner-tasks",
      "Open beginner tasks",
      starterTasks.length,
      "Committed starter-level task entries on non-demo active projects.",
      "Current committed registry",
      "registry/projects",
      "A listed task is not a guarantee of immediate mentor availability.",
    ),
    metric(
      "represented-tracks",
      "Contribution tracks represented",
      tracks.size,
      "Distinct contribution tracks represented by non-demo active projects.",
      "Current committed registry",
      "registry/projects",
      "This shows opportunity types, not the number or worth of contributors.",
    ),
    metric(
      "two-maintainers",
      "Active projects with two available maintainers",
      `${activeProjects.length ? Math.round((twoMaintainers.length / activeProjects.length) * 100) : 0}%`,
      "Share of active projects with at least two maintainers marked available.",
      "Current committed registry",
      "registry/projects",
      "The registry currently contains forming stewardship, not a claim of contributor capacity.",
    ),
  ];
}

function metric(
  id: string,
  label: string,
  value: string | number,
  definition: string,
  timeWindow: string,
  source: string,
  limitation: string,
): CommunityMetric {
  return { id, label, value: String(value), definition, timeWindow, source, limitation };
}
