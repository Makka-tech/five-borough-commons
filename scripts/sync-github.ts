import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { Octokit } from "@octokit/rest";
import {
  normalizeIssue,
  normalizePullRequest,
  normalizeRepository,
  type CommunitySnapshot,
} from "../src/lib/github/snapshot";

const outputPath = path.join(process.cwd(), "public", "generated", "community-snapshot.json");
const cachePath = path.join(process.cwd(), ".cache", "github-snapshot-cache.json");
const token = process.env.GITHUB_TOKEN;
const configuredRepositories = (process.env.GITHUB_REPOSITORY ?? "")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);
const configuredOrganizations = (process.env.GITHUB_ORG ?? "")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);

type RepositoryRef = { owner: string; repo: string };

function parseRepository(fullName: string): RepositoryRef {
  const [owner, repo, ...rest] = fullName.split("/");
  if (!owner || !repo || rest.length)
    throw new Error(`GITHUB_REPOSITORY must use owner/repository format; received '${fullName}'.`);
  return { owner, repo };
}

async function readCommittedFixture(): Promise<CommunitySnapshot> {
  return JSON.parse(await readFile(outputPath, "utf8")) as CommunitySnapshot;
}

async function getRepositoryRefs(octokit: Octokit): Promise<RepositoryRef[]> {
  const direct = configuredRepositories.map(parseRepository);
  const organizationRepositories = (
    await Promise.all(
      configuredOrganizations.map(async (org) => {
        const repositories = await octokit.paginate(octokit.rest.repos.listForOrg, {
          org,
          type: "public",
          sort: "updated",
          direction: "desc",
          per_page: 100,
        });
        return repositories
          .filter((repository) => !repository.archived)
          .map((repository) => ({ owner: repository.owner.login, repo: repository.name }));
      }),
    )
  ).flat();
  return [
    ...new Map(
      [...direct, ...organizationRepositories].map((reference) => [
        `${reference.owner}/${reference.repo}`,
        reference,
      ]),
    ).values(),
  ];
}

async function getDiscussions(octokit: Octokit, owner: string, repo: string) {
  if (!token) return [];
  try {
    const result = await octokit.graphql<{
      repository: {
        discussions: {
          nodes: Array<{ number: number; title: string; url: string; updatedAt: string }>;
        } | null;
      } | null;
    }>(
      `query Discussions($owner: String!, $repo: String!) { repository(owner: $owner, name: $repo) { discussions(first: 50, orderBy: {field: UPDATED_AT, direction: DESC}) { nodes { number title url updatedAt } } } }`,
      { owner, repo },
    );
    return (
      result.repository?.discussions?.nodes.map((discussion) => ({
        repository: `${owner}/${repo}`,
        ...discussion,
      })) ?? []
    );
  } catch (error) {
    console.warn(
      `Could not retrieve Discussions for ${owner}/${repo}; continuing without them. ${error instanceof Error ? error.message : ""}`,
    );
    return [];
  }
}

async function main() {
  if (!configuredRepositories.length && !configuredOrganizations.length) {
    const fixture = await readCommittedFixture();
    console.log(
      "No GITHUB_REPOSITORY or GITHUB_ORG is configured; retaining committed fixture snapshot.",
    );
    console.log(`Fixture source: ${fixture.source}.`);
    return;
  }
  const octokit = new Octokit({ auth: token, userAgent: "five-borough-commons-sync" });
  const refs = await getRepositoryRefs(octokit);
  const snapshot: CommunitySnapshot = {
    generatedAt: new Date().toISOString(),
    source: "github api",
    limitations: [
      "Public GitHub metadata only. Private profile data is not copied.",
      "Issue endpoints can include pull requests, so pull-request-shaped results are excluded from issues.",
    ],
    repositories: [],
    issues: [],
    pullRequests: [],
    releases: [],
    contributors: [],
    discussions: [],
  };
  for (const { owner, repo } of refs) {
    const repository = await octokit.rest.repos.get({
      owner,
      repo,
      headers: { "X-GitHub-Api-Version": "2026-03-10" },
    });
    const fullName = `${owner}/${repo}`;
    snapshot.repositories.push(normalizeRepository(repository.data));
    const [issues, pulls, contributors, releases] = await Promise.all([
      octokit.paginate(octokit.rest.issues.listForRepo, {
        owner,
        repo,
        state: "open",
        per_page: 100,
      }),
      octokit.paginate(octokit.rest.pulls.list, { owner, repo, state: "open", per_page: 100 }),
      octokit.paginate(octokit.rest.repos.listContributors, { owner, repo, per_page: 100 }),
      octokit.paginate(octokit.rest.repos.listReleases, { owner, repo, per_page: 100 }),
    ]);
    snapshot.issues.push(
      ...issues
        .filter((issue) => !issue.pull_request)
        .map((issue) => normalizeIssue(fullName, issue)),
    );
    snapshot.pullRequests.push(...pulls.map((pull) => normalizePullRequest(fullName, pull)));
    snapshot.contributors.push(
      ...contributors
        .filter((contributor) => contributor.type === "User" && contributor.login)
        .map((contributor) => ({
          repository: fullName,
          login: contributor.login!,
          contributions: contributor.contributions ?? 0,
        })),
    );
    snapshot.releases.push(
      ...releases.map((release) => ({
        repository: fullName,
        name: release.name ?? release.tag_name,
        url: release.html_url,
        publishedAt: release.published_at,
        tagName: release.tag_name,
      })),
    );
    if (repository.data.has_discussions)
      snapshot.discussions?.push(...(await getDiscussions(octokit, owner, repo)));
  }
  await mkdir(path.dirname(outputPath), { recursive: true });
  await mkdir(path.dirname(cachePath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(snapshot, null, 2)}\n`);
  await writeFile(
    cachePath,
    `${JSON.stringify({ refreshedAt: snapshot.generatedAt, repositoryCount: refs.length }, null, 2)}\n`,
  );
  console.log(
    `Wrote snapshot for ${refs.length} public repository${refs.length === 1 ? "" : "ies"}.`,
  );
}

void main().catch((error) => {
  const status = (error as { status?: number }).status;
  if (status === 403 || status === 429)
    console.error(
      "GitHub rate limit reached. Retry after the reset time; no partial snapshot was written.",
    );
  else console.error(error);
  process.exitCode = 1;
});
