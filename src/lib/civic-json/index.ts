import { z } from "zod";
import { boroughSchema, contributionTrackSchema, type CivicProject } from "@/lib/registry/schemas";

/** A deliberately small, portable subset of civic-tech `civic.json` metadata. */
export const civicJsonSchema = z
  .object({
    name: z.string().min(1),
    description: z.string().min(1).optional(),
    repository: z.string().url().optional(),
    homepage: z.string().url().optional(),
    status: z.string().optional(),
    tags: z.array(z.string()).optional(),
    contact: z
      .object({ email: z.string().email().optional(), url: z.string().url().optional() })
      .optional(),
  })
  .passthrough();

export type CivicJson = z.infer<typeof civicJsonSchema>;

export function parseCivicJson(value: unknown): CivicJson {
  return civicJsonSchema.parse(value);
}

export function normalizeCivicJson(
  value: unknown,
  defaults: Pick<CivicProject, "id" | "boroughs" | "maintainers" | "createdAt" | "lastReviewed">,
): Partial<CivicProject> {
  const civic = parseCivicJson(value);
  const statusMap: Record<string, CivicProject["status"]> = {
    proposed: "proposed",
    discovery: "discovery",
    prototype: "prototype",
    pilot: "pilot",
    maintained: "maintained",
    archived: "archived",
  };
  return {
    id: defaults.id,
    slug: defaults.id,
    name: civic.name,
    tagline: civic.description?.slice(0, 180) ?? civic.name,
    summary: civic.description ?? "No public description has been provided.",
    status: statusMap[civic.status?.toLowerCase() ?? ""] ?? "proposed",
    demo: false,
    boroughs: defaults.boroughs,
    problemStatement: civic.description ?? "Needs discovery with affected residents.",
    residentValue: "Needs community validation.",
    currentScope:
      "Imported civic.json metadata requires Five Borough Commons stewardship details before publication.",
    nonGoals: ["Not yet documented."],
    repositoryUrl: civic.repository,
    websiteUrl: civic.homepage,
    maintainers: defaults.maintainers,
    partners: [],
    contributionTracks: civic.tags
      ?.filter(
        (tag): tag is z.infer<typeof contributionTrackSchema> =>
          contributionTrackSchema.safeParse(tag).success,
      )
      .map((track) => ({
        track,
        description: "Imported contribution track; add a project-specific description.",
        beginnerFriendly: false,
        mentorAvailable: false,
        participation: ["remote"],
      })) ?? [
      {
        track: "documentation",
        description: "Imported project metadata needs documentation review.",
        beginnerFriendly: true,
        mentorAvailable: false,
        participation: ["remote"],
      },
    ],
    skills: civic.tags?.length ? civic.tags : ["not yet documented"],
    timeCommitments: ["1 hour"],
    participation: ["remote"],
    tasks: [],
    timeline: [],
    limitations: ["Imported metadata has not yet been fully reviewed by Five Borough Commons."],
    dataSources: [],
    impactEvidence: [],
    stewardship: { indicators: ["Seeking co-maintainer"] },
    createdAt: defaults.createdAt,
    lastReviewed: defaults.lastReviewed,
  };
}

export function exportCivicJson(project: CivicProject): CivicJson {
  return {
    name: project.name,
    description: project.summary,
    repository: project.repositoryUrl,
    homepage: project.websiteUrl,
    status: project.status,
    tags: [
      ...new Set([...project.skills, ...project.contributionTracks.map((item) => item.track)]),
    ],
  };
}

export { boroughSchema };
