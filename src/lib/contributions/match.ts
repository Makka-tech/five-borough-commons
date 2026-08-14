import type { CivicProject, ContributionTrack, TimeCommitment } from "@/lib/registry/schemas";

export type ContributionPreferences = {
  tracks: ContributionTrack[];
  availableTime: TimeCommitment;
  experience: "new" | "some" | "experienced";
  borough?: CivicProject["boroughs"][number];
  collaboration: "independent" | "collaborative";
};

export type RecommendedTask = {
  project: CivicProject;
  task: CivicProject["tasks"][number];
  reasons: string[];
  score: number;
};

const effortRank: Record<TimeCommitment, number> = {
  "15 minutes": 1,
  "1 hour": 2,
  "2–4 hours": 3,
  weekly: 4,
  ongoing: 5,
};

/** Deterministically ranks committed metadata; no profile or identity inference is used. */
export function recommendTasks(
  projects: CivicProject[],
  preferences: ContributionPreferences,
): RecommendedTask[] {
  const candidates = projects
    .filter((project) => !project.demo && !["archived", "paused"].includes(project.status))
    .flatMap((project) => project.tasks.map((task) => ({ project, task })))
    .filter(({ project, task }) => {
      const hasTime = effortRank[task.effort] <= effortRank[preferences.availableTime];
      const hasBorough =
        !preferences.borough ||
        project.boroughs.includes("Citywide") ||
        project.boroughs.includes(preferences.borough);
      const hasCollaboration =
        task.collaboration === "either" || task.collaboration === preferences.collaboration;
      return hasTime && hasBorough && hasCollaboration;
    })
    .map(({ project, task }) => {
      const reasons: string[] = [];
      let score = 0;
      if (preferences.tracks.includes(task.track)) {
        score += 50;
        reasons.push(`You selected ${task.track.replaceAll("-", " ")}.`);
      }
      if (task.effort === preferences.availableTime) {
        score += 25;
        reasons.push(`This task is estimated at ${task.effort}.`);
      } else {
        score += 10;
        reasons.push(`This task fits within your available ${preferences.availableTime}.`);
      }
      if (preferences.experience === "new" && task.difficulty === "starter") {
        score += 20;
        reasons.push("It is marked as a starter task.");
      }
      if (task.mentorAvailable) reasons.push("A mentor is available.");
      else if (task.difficulty === "starter")
        reasons.push("No local development setup is required unless the task says otherwise.");
      if (task.collaboration === preferences.collaboration) {
        score += 5;
        reasons.push(`It is designed for ${preferences.collaboration} work.`);
      }
      return { project, task, reasons, score };
    });

  return candidates
    .sort(
      (left, right) =>
        right.score - left.score ||
        left.project.name.localeCompare(right.project.name) ||
        left.task.title.localeCompare(right.task.title),
    )
    .slice(0, 6);
}

export function isTimeEstimateCompatible(
  taskEffort: TimeCommitment,
  availableTime: TimeCommitment,
): boolean {
  return effortRank[taskEffort] <= effortRank[availableTime];
}
