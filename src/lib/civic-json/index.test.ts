import { describe, expect, it } from "vitest";
import { exportCivicJson, normalizeCivicJson, parseCivicJson } from "@/lib/civic-json";
import type { CivicProject } from "@/lib/registry/schemas";

const defaults: Pick<
  CivicProject,
  "id" | "boroughs" | "maintainers" | "createdAt" | "lastReviewed"
> = {
  id: "sample-project",
  boroughs: ["Citywide"],
  maintainers: [{ displayName: "Seeking steward", role: "Forming", availability: "forming" }],
  createdAt: "2026-08-13",
  lastReviewed: "2026-08-13",
};

describe("civic.json adapter", () => {
  it("normalizes the supported subset", () => {
    const normalized = normalizeCivicJson(
      {
        name: "Sample",
        description: "Plain language description",
        repository: "https://github.com/example/sample",
        tags: ["documentation"],
      },
      defaults,
    );
    expect(normalized.slug).toBe("sample-project");
    expect(normalized.contributionTracks?.[0]?.track).toBe("documentation");
  });
  it("preserves public fields on export", () => {
    const project = {
      ...normalizeCivicJson({ name: "Sample", description: "Description" }, defaults),
      ...defaults,
    };
    expect(exportCivicJson(project as never).name).toBe("Sample");
  });
  it("rejects an invalid URL", () =>
    expect(() => parseCivicJson({ name: "Sample", repository: "not-a-url" })).toThrow());
});
