import { Octokit } from "@octokit/rest";
const apply = process.argv.includes("--apply");
const labels = [
  "good first issue",
  "help wanted",
  "mentor available",
  "track:code",
  "track:data",
  "track:design",
  "track:docs",
  "track:translation",
  "track:research",
  "track:testing",
  "track:accessibility",
  "track:outreach",
  "effort:15m",
  "effort:1h",
  "effort:half-day",
  "effort:ongoing",
  "difficulty:starter",
  "difficulty:intermediate",
  "difficulty:advanced",
  "status:needs-triage",
  "status:ready",
  "status:blocked",
  "status:in-progress",
  "borough:manhattan",
  "borough:brooklyn",
  "borough:queens",
  "borough:bronx",
  "borough:staten-island",
  "borough:citywide",
];
async function main() {
  const repository = process.env.GITHUB_REPOSITORY;
  if (!repository) throw new Error("Set GITHUB_REPOSITORY=owner/repository.");
  console.log(`${apply ? "Applying" : "Dry run:"} ${labels.length} labels for ${repository}.`);
  if (!apply) return;
  const [owner, repo] = repository.split("/");
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
  for (const name of labels)
    await octokit.rest.issues.createLabel({ owner, repo, name, color: "0E7490" });
}
void main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
