import { readFile } from "node:fs/promises";
import path from "node:path";
import { parse } from "yaml";
import { describe, expect, it } from "vitest";
import { calculateCommunityMetrics } from "@/lib/community/metrics";
import { civicProjectSchema } from "@/lib/registry/schemas";

describe("community metrics", () => {
  it("reports transparent metrics without a community score", async () => {
    const project = civicProjectSchema.parse(
      parse(
        await readFile(
          path.join(process.cwd(), "registry/projects/five-borough-commons-core.yml"),
          "utf8",
        ),
      ),
    );
    const metrics = calculateCommunityMetrics([project]);
    expect(metrics.find((metric) => metric.id === "active-projects")?.value).toBe("1");
    expect(metrics.some((metric) => metric.label.toLowerCase().includes("score"))).toBe(false);
  });
});
