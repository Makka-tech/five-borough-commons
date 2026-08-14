import { cp, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
async function replaceTokens(directory: string, tokens: Record<string, string>) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) await replaceTokens(file, tokens);
    else {
      const content = await readFile(file, "utf8");
      await writeFile(
        file,
        Object.entries(tokens).reduce(
          (result, [token, value]) => result.replaceAll(`{{${token}}}`, value),
          content,
        ),
      );
    }
  }
}
async function main() {
  const prompt = createInterface({ input, output });
  try {
    const name = await prompt.question("Project name: ");
    const residentProblem = await prompt.question("Resident problem: ");
    const boroughs = await prompt.question("Borough coverage (comma separated): ");
    const maintainers = await prompt.question("Proposed maintainers: ");
    const tracks = await prompt.question("Contribution tracks (comma separated): ");
    const dataSources = await prompt.question("Public data sources: ");
    const scope = await prompt.question("Current scope: ");
    const nonGoals = await prompt.question("Non-goals: ");
    const milestones = await prompt.question("Initial milestones: ");
    const slug = slugify(name);
    if (!slug || !residentProblem)
      throw new Error("A project name and resident problem are required.");
    const target = path.join(process.cwd(), "generated-projects", slug);
    await mkdir(path.dirname(target), { recursive: true });
    await cp(path.join(process.cwd(), "templates", "civic-project"), target, {
      recursive: true,
      errorOnExist: true,
    });
    await replaceTokens(target, {
      PROJECT_NAME: name,
      PROJECT_SLUG: slug,
      RESIDENT_PROBLEM: residentProblem,
      BOROUGHS: boroughs,
      MAINTAINERS: maintainers,
      TRACKS: tracks,
      DATA_SOURCES: dataSources,
      SCOPE: scope,
      NON_GOALS: nonGoals,
      MILESTONES: milestones,
    });
    console.log(`Created ${target}. No remote GitHub changes were made.`);
  } finally {
    prompt.close();
  }
}
void main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
