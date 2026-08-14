import { describe, expect, it } from "vitest";
import { normalizeIssue, normalizeRepository } from "@/lib/github/snapshot";

describe("GitHub snapshot normalization", () => {
  it("normalizes public repository metadata", () =>
    expect(
      normalizeRepository({
        full_name: "example/project",
        html_url: "https://github.com/example/project",
        description: null,
        updated_at: "2026-08-13T00:00:00Z",
        pushed_at: null,
        has_discussions: true,
      }).hasDiscussions,
    ).toBe(true));
  it("uses labels and excludes no data while normalizing an issue", () => {
    expect(
      normalizeIssue("example/project", {
        number: 4,
        title: "Document context",
        html_url: "https://github.com/example/project/issues/4",
        labels: [{ name: "good first issue" }],
        created_at: "2026-08-13T00:00:00Z",
        updated_at: "2026-08-13T00:00:00Z",
        user: null,
      }).labels,
    ).toEqual(["good first issue"]);
  });
});
