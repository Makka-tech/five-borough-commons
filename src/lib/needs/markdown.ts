export type NeedDraft = {
  title: string;
  whatIsHappening: string;
  whoIsAffected: string;
  location: string;
  currentWorkaround: string;
  possibleHelp: string;
  publicSources: string;
  wantsToParticipate: boolean;
};

export function needToMarkdown(draft: NeedDraft): string {
  return `## What is happening?\n${draft.whatIsHappening}\n\n## Who is affected?\n${draft.whoIsAffected}\n\n## Where does it occur?\n${draft.location}\n\n## How do people handle it now?\n${draft.currentWorkaround}\n\n## What information or service may help?\n${draft.possibleHelp}\n\n## Supporting public sources\n${draft.publicSources || "None shared"}\n\n## Would you like to participate?\n${draft.wantsToParticipate ? "Yes" : "Not at this time"}\n\n---\nI understand that submitting a need does not guarantee that a software project will be created.`;
}

export function githubIssueUrl(
  repository: string | undefined,
  draft: NeedDraft,
): string | undefined {
  if (!repository || !/^[\w.-]+\/[\w.-]+$/.test(repository)) return undefined;
  return `https://github.com/${repository}/issues/new?title=${encodeURIComponent(draft.title)}&body=${encodeURIComponent(needToMarkdown(draft))}`;
}
