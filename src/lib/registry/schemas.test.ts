import { readFile } from "node:fs/promises";
import path from "node:path";
import { parse } from "yaml";
import { describe, expect, it } from "vitest";
import {
  civicNeedSchema,
  civicProjectSchema,
  contributorProfileSchema,
} from "@/lib/registry/schemas";

describe("registry schemas", () => {
  it("accepts the committed core project", async () => {
    const value = parse(
      await readFile(
        path.join(process.cwd(), "registry/projects/five-borough-commons-core.yml"),
        "utf8",
      ),
    );
    expect(civicProjectSchema.parse(value).slug).toBe("five-borough-commons-core");
  });
  it("rejects invalid project ids with a useful issue path", () => {
    const result = civicProjectSchema.safeParse({ id: "Not a slug" });
    expect(result.success).toBe(false);
    if (!result.success)
      expect(result.error.issues.some((issue) => issue.path[0] === "id")).toBe(true);
  });
  it("rejects sensitive, undeclared need fields", () => {
    const result = civicNeedSchema.safeParse({
      id: "safe-need",
      title: "Safe need",
      status: "submitted",
      demo: false,
      whatIsHappening: "A clear problem",
      whoIsAffected: "Residents",
      boroughs: ["Queens"],
      currentWorkaround: "They ask around",
      possibleHelp: "A guide",
      submitterWantsToParticipate: false,
      createdAt: "2026-08-13",
      immigrationStatus: "private",
    });
    expect(result.success).toBe(false);
  });
  it("keeps optional profile identity fields optional and respects display choice", () => {
    const profile = contributorProfileSchema.parse({
      githubUsername: "volunteer",
      contributionTracks: ["documentation"],
      projects: ["five-borough-commons-core"],
      showOnCommunityPage: false,
    });
    expect(profile.showOnCommunityPage).toBe(false);
    expect(profile.displayName).toBeUndefined();
  });
});
