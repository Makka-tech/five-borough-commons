import type { CivicProject } from "@/lib/registry/schemas";

export const projectStatusLabel: Record<CivicProject["status"], string> = {
  proposed: "Proposed",
  discovery: "Discovery",
  prototype: "Prototype",
  pilot: "Pilot",
  maintained: "Maintained",
  "needs-maintainer": "Needs maintainer",
  paused: "Paused",
  archived: "Archived",
};

export const trackLabel: Record<CivicProject["contributionTracks"][number]["track"], string> = {
  code: "Code",
  data: "Data",
  design: "Design",
  documentation: "Documentation",
  translation: "Translation",
  "accessibility-review": "Accessibility review",
  "user-research": "User research",
  "community-outreach": "Community outreach",
  "policy-or-domain-research": "Policy or domain research",
  testing: "Testing",
  "project-management": "Project management",
};

export function formatProjectStatus(status: CivicProject["status"]): string {
  return projectStatusLabel[status];
}
