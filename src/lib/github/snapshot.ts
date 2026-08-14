export type CommunitySnapshot = {
  generatedAt: string;
  source: "committed fixture" | "github api";
  limitations: string[];
  repositories: Array<{
    fullName: string;
    url: string;
    description: string | null;
    updatedAt: string | null;
    pushedAt: string | null;
    hasDiscussions: boolean;
  }>;
  issues: Array<{
    repository: string;
    number: number;
    title: string;
    url: string;
    labels: string[];
    createdAt: string;
    updatedAt: string;
    author: string | null;
  }>;
  pullRequests: Array<{
    repository: string;
    number: number;
    title: string;
    url: string;
    state: string;
    createdAt: string;
    updatedAt: string;
    mergedAt: string | null;
    author: string | null;
  }>;
  releases: Array<{
    repository: string;
    name: string;
    url: string;
    publishedAt: string | null;
    tagName: string;
  }>;
  contributors: Array<{ repository: string; login: string; contributions: number }>;
  discussions?: Array<{
    repository: string;
    number: number;
    title: string;
    url: string;
    updatedAt: string;
  }>;
};

export function normalizeRepository(repository: {
  full_name: string;
  html_url: string;
  description: string | null;
  updated_at: string | null;
  pushed_at: string | null;
  has_discussions?: boolean;
}) {
  return {
    fullName: repository.full_name,
    url: repository.html_url,
    description: repository.description,
    updatedAt: repository.updated_at,
    pushedAt: repository.pushed_at,
    hasDiscussions: repository.has_discussions ?? false,
  };
}

export function normalizeIssue(
  repository: string,
  issue: {
    number: number;
    title: string;
    html_url: string;
    labels: Array<{ name?: string } | string>;
    created_at: string;
    updated_at: string;
    user: { login: string } | null;
  },
) {
  return {
    repository,
    number: issue.number,
    title: issue.title,
    url: issue.html_url,
    labels: issue.labels
      .map((label) => (typeof label === "string" ? label : (label.name ?? "")))
      .filter(Boolean),
    createdAt: issue.created_at,
    updatedAt: issue.updated_at,
    author: issue.user?.login ?? null,
  };
}

export function normalizePullRequest(
  repository: string,
  pull: {
    number: number;
    title: string;
    html_url: string;
    state: string;
    created_at: string;
    updated_at: string;
    merged_at?: string | null;
    user: { login: string } | null;
  },
) {
  return {
    repository,
    number: pull.number,
    title: pull.title,
    url: pull.html_url,
    state: pull.state,
    createdAt: pull.created_at,
    updatedAt: pull.updated_at,
    mergedAt: pull.merged_at ?? null,
    author: pull.user?.login ?? null,
  };
}
