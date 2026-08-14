import { readFile } from "node:fs/promises";
import path from "node:path";
import { parse } from "yaml";
import { describe, expect, it } from "vitest";
import {
  isTimeEstimateCompatible,
  recommendTasks,
  type ContributionPreferences,
} from "@/lib/contributions/match";
import { civicProjectSchema } from "@/lib/registry/schemas";

async function coreProject() {
  return civicProjectSchema.parse(
    parse(
      await readFile(
        path.join(process.cwd(), "registry/projects/five-borough-commons-core.yml"),
        "utf8",
      ),
    ),
  );
}

describe("contribution matching", () => {
  it("is deterministic and explains a track match", async () => {
    const project = await coreProject();
    const preferences: ContributionPreferences = {
      tracks: ["documentation"],
      availableTime: "1 hour",
      experience: "new",
      collaboration: "independent",
    };
    const first = recommendTasks([project], preferences);
    const second = recommendTasks([project], preferences);
    expect(first.map((item) => item.task.id)).toEqual(second.map((item) => item.task.id));
    expect(first[0]?.reasons).toContain("You selected documentation.");
  });
  it("does not recommend a task above the stated time estimate", () => {
    expect(isTimeEstimateCompatible("15 minutes", "1 hour")).toBe(true);
    expect(isTimeEstimateCompatible("2–4 hours", "1 hour")).toBe(false);
  });
});
