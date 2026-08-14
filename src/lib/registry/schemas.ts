import { z } from "zod";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const safeText = (label: string, max = 2000) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required.`)
    .max(max, `${label} must be ${max} characters or fewer.`)
    .refine(
      (value) => !/<\/?[a-z][\s\S]*>/i.test(value),
      `${label} cannot contain HTML. Use plain text or Markdown links.`,
    );
const date = (label: string) =>
  z.string().regex(ISO_DATE, `${label} must use YYYY-MM-DD (for example, 2026-08-13).`);
const url = (label: string) =>
  z.url(`${label} must be a valid https:// URL.`).startsWith("https://");

export const boroughSchema = z.enum([
  "Manhattan",
  "Brooklyn",
  "Queens",
  "The Bronx",
  "Staten Island",
  "Citywide",
]);

export const projectStatusSchema = z.enum([
  "proposed",
  "discovery",
  "prototype",
  "pilot",
  "maintained",
  "needs-maintainer",
  "paused",
  "archived",
]);

export const contributionTrackSchema = z.enum([
  "code",
  "data",
  "design",
  "documentation",
  "translation",
  "accessibility-review",
  "user-research",
  "community-outreach",
  "policy-or-domain-research",
  "testing",
  "project-management",
]);

export const timeCommitmentSchema = z.enum([
  "15 minutes",
  "1 hour",
  "2–4 hours",
  "weekly",
  "ongoing",
]);

export const participationModeSchema = z.enum(["remote", "in-person", "hybrid"]);

const slug = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase kebab-case, for example nyc-blockcheck.");

const maintainerReferenceSchema = z
  .object({
    displayName: safeText("Maintainer display name", 120),
    githubUsername: z
      .string()
      .regex(/^[A-Za-z0-9-]{1,39}$/, "Use a valid GitHub username.")
      .optional(),
    role: safeText("Maintainer role", 120),
    availability: z.enum(["available", "seeking-co-maintainer", "forming", "inactive"]),
  })
  .strict();

const partnerReferenceSchema = z
  .object({
    name: safeText("Partner name", 160),
    verificationUrl: url("Partner verification URL"),
    relationship: safeText("Partner relationship", 240),
  })
  .strict();

const contributionTrackDetailSchema = z
  .object({
    track: contributionTrackSchema,
    description: safeText("Contribution track description", 500),
    beginnerFriendly: z.boolean(),
    mentorAvailable: z.boolean(),
    participation: z.array(participationModeSchema).min(1),
  })
  .strict();

const taskSchema = z
  .object({
    id: slug,
    title: safeText("Task title", 160),
    description: safeText("Task description", 1000),
    track: contributionTrackSchema,
    skills: z.array(safeText("Skill", 80)).max(12),
    effort: timeCommitmentSchema,
    difficulty: z.enum(["starter", "intermediate", "advanced"]),
    mentorAvailable: z.boolean(),
    participation: participationModeSchema,
    collaboration: z.enum(["independent", "collaborative", "either"]),
    issueUrl: url("Task issue URL").optional(),
    acceptanceCriteria: z.array(safeText("Acceptance criterion", 300)).min(1),
  })
  .strict();

const timelineEventSchema = z
  .object({
    date: date("Timeline date"),
    title: safeText("Timeline title", 160),
    description: safeText("Timeline description", 500),
  })
  .strict();

const dataSourceSchema = z
  .object({
    name: safeText("Data source name", 180),
    url: url("Data source URL"),
    notes: safeText("Data source notes", 600).optional(),
  })
  .strict();

const impactEvidenceSchema = z
  .object({
    claim: safeText("Impact claim", 500),
    evidenceUrl: url("Impact evidence URL"),
    measuredAt: date("Impact evidence date"),
    methodology: safeText("Impact methodology", 800).optional(),
  })
  .strict();

export const civicProjectSchema = z
  .object({
    id: slug,
    name: safeText("Project name", 120),
    slug,
    tagline: safeText("Project tagline", 180),
    summary: safeText("Project summary", 1000),
    status: projectStatusSchema,
    demo: z.boolean(),
    boroughs: z.array(boroughSchema).min(1),
    neighborhoods: z.array(safeText("Neighborhood", 100)).max(20).optional(),
    problemStatement: safeText("Problem statement", 2000),
    residentValue: safeText("Resident value", 1200),
    currentScope: safeText("Current scope", 1800),
    nonGoals: z.array(safeText("Non-goal", 500)).min(1),
    repositoryUrl: url("Repository URL").optional(),
    websiteUrl: url("Website URL").optional(),
    issuesUrl: url("Issues URL").optional(),
    discussionsUrl: url("Discussions URL").optional(),
    roadmapUrl: url("Roadmap URL").optional(),
    maintainers: z.array(maintainerReferenceSchema).min(1),
    partners: z.array(partnerReferenceSchema),
    contributionTracks: z.array(contributionTrackDetailSchema).min(1),
    skills: z.array(safeText("Skill", 80)).min(1),
    timeCommitments: z.array(timeCommitmentSchema).min(1),
    participation: z.array(participationModeSchema).min(1),
    tasks: z.array(taskSchema).default([]),
    nextMilestone: safeText("Next milestone", 300).optional(),
    timeline: z.array(timelineEventSchema).default([]),
    limitations: z.array(safeText("Limitation", 600)).default([]),
    dataSources: z.array(dataSourceSchema).default([]),
    impactEvidence: z.array(impactEvidenceSchema).default([]),
    meetingInfo: z
      .object({
        cadence: safeText("Meeting cadence", 160),
        publicNotesUrl: url("Public notes URL").optional(),
        joiningInstructions: safeText("Joining instructions", 500).optional(),
      })
      .strict()
      .optional(),
    stewardship: z
      .object({
        indicators: z.array(
          z.enum([
            "Maintainer available",
            "Seeking co-maintainer",
            "Beginner tasks available",
            "Roadmap reviewed recently",
            "Public meeting available",
            "Release process documented",
            "Support process documented",
            "Paused with explanation",
            "Archive candidate",
          ]),
        ),
        lastStewardshipReview: date("Stewardship review date").optional(),
      })
      .strict(),
    lastReviewed: date("Last reviewed date"),
    createdAt: date("Creation date"),
  })
  .strict()
  .superRefine((project, ctx) => {
    if (project.id !== project.slug) {
      ctx.addIssue({
        code: "custom",
        path: ["id"],
        message: "id must match slug so registry references remain stable.",
      });
    }
    if (
      project.status === "needs-maintainer" &&
      !project.stewardship.indicators.includes("Seeking co-maintainer")
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["stewardship", "indicators"],
        message:
          "Needs-maintainer projects must include the ‘Seeking co-maintainer’ stewardship indicator.",
      });
    }
    if (
      project.status === "archived" &&
      !project.stewardship.indicators.includes("Paused with explanation")
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["stewardship", "indicators"],
        message: "Archived projects must document their stewardship explanation.",
      });
    }
  });

export const civicNeedStatusSchema = z.enum([
  "submitted",
  "needs-clarification",
  "researching",
  "validated-need",
  "project-candidate",
  "accepted-for-incubation",
  "not-suitable-for-software",
  "merged-with-existing-work",
  "closed-with-resources",
]);

export const civicNeedSchema = z
  .object({
    id: slug,
    title: safeText("Need title", 160),
    status: civicNeedStatusSchema,
    demo: z.boolean(),
    whatIsHappening: safeText("What is happening", 2000),
    whoIsAffected: safeText("Who is affected", 500),
    boroughs: z.array(boroughSchema).min(1),
    neighborhoods: z.array(safeText("Neighborhood", 100)).max(20).optional(),
    currentWorkaround: safeText("Current workaround", 1200),
    possibleHelp: safeText("Possible help", 1200),
    publicSources: z.array(url("Public source URL")).default([]),
    submitterWantsToParticipate: z.boolean(),
    createdAt: date("Creation date"),
  })
  .strict();

export const eventSchema = z
  .object({
    id: slug,
    title: safeText("Event title", 160),
    type: z.enum([
      "community-orientation",
      "project-demo",
      "contribution-session",
      "public-roadmap-review",
      "maintainer-meeting",
      "user-research-session",
    ]),
    demo: z.boolean(),
    startsAt: z.string().datetime({ offset: true }),
    endsAt: z.string().datetime({ offset: true }).optional(),
    participation: participationModeSchema,
    location: safeText("Event location", 200).optional(),
    joiningUrl: url("Joining URL").optional(),
    description: safeText("Event description", 1000),
    projectSlugs: z.array(slug).default([]),
    public: z.boolean(),
  })
  .strict();

export const contributorProfileSchema = z
  .object({
    githubUsername: z.string().regex(/^[A-Za-z0-9-]{1,39}$/, "Use a valid GitHub username."),
    displayName: safeText("Display name", 120).optional(),
    pronouns: safeText("Pronouns", 80).optional(),
    bio: safeText("Bio", 500).optional(),
    contributionTracks: z.array(contributionTrackSchema),
    languages: z.array(safeText("Language", 80)).optional(),
    borough: boroughSchema.optional(),
    projects: z.array(slug),
    showOnCommunityPage: z.boolean(),
  })
  .strict();

export type CivicProject = z.infer<typeof civicProjectSchema>;
export type CivicNeed = z.infer<typeof civicNeedSchema>;
export type CommunityEvent = z.infer<typeof eventSchema>;
export type ContributorProfile = z.infer<typeof contributorProfileSchema>;
export type ContributionTrack = z.infer<typeof contributionTrackSchema>;
export type TimeCommitment = z.infer<typeof timeCommitmentSchema>;
