"use client";

import { useMemo, useState } from "react";
import { githubIssueUrl, needToMarkdown, type NeedDraft } from "@/lib/needs/markdown";

const initialDraft: NeedDraft = {
  title: "",
  whatIsHappening: "",
  whoIsAffected: "",
  location: "",
  currentWorkaround: "",
  possibleHelp: "",
  publicSources: "",
  wantsToParticipate: false,
};

export function NeedForm({ repository }: { repository?: string }) {
  const [draft, setDraft] = useState(initialDraft);
  const [copied, setCopied] = useState(false);
  const markdown = useMemo(() => needToMarkdown(draft), [draft]);
  const issueUrl = useMemo(() => githubIssueUrl(repository, draft), [draft, repository]);
  const complete = [
    draft.title,
    draft.whatIsHappening,
    draft.whoIsAffected,
    draft.location,
    draft.currentWorkaround,
    draft.possibleHelp,
  ].every((value) => value.trim().length > 0);
  const update = <K extends keyof NeedDraft>(key: K, value: NeedDraft[K]) =>
    setDraft((current) => ({ ...current, [key]: value }));

  async function copyMarkdown() {
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2500);
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8">
      <div className="max-w-3xl">
        <p className="text-sm font-bold tracking-[0.15em] text-orange-700 uppercase dark:text-orange-300">
          Bring a civic need
        </p>
        <h1 className="mt-2 font-serif text-4xl font-bold tracking-tight text-slate-950 dark:text-stone-50">
          Start with what people are experiencing.
        </h1>
        <p className="mt-4 text-lg leading-8 text-slate-700 dark:text-slate-300">
          This form does not create a project or collect an account. It helps you prepare a clear,
          privacy-aware GitHub Issue for community triage.
        </p>
      </div>
      <div className="mt-7 rounded-sm border-l-4 border-orange-700 bg-orange-50 p-5 text-sm leading-6 text-orange-950 dark:bg-orange-950/50 dark:text-orange-100">
        <p className="font-bold">Please don’t include sensitive personal information.</p>
        <p className="mt-1">
          Do not include exact home addresses, immigration status, medical information, government
          identification, names of vulnerable people, or allegations about identifiable private
          people.
        </p>
      </div>
      <form
        className="mt-8 grid gap-8 lg:grid-cols-[1fr_22rem]"
        onSubmit={(event) => event.preventDefault()}
      >
        <div className="space-y-5">
          <TextField
            label="A short title"
            value={draft.title}
            onChange={(value) => update("title", value)}
            placeholder="What needs to be easier or clearer?"
          />
          <TextArea
            label="What is happening?"
            value={draft.whatIsHappening}
            onChange={(value) => update("whatIsHappening", value)}
            hint="Describe the problem in plain language. Avoid names and sensitive details."
          />
          <TextArea
            label="Who is affected?"
            value={draft.whoIsAffected}
            onChange={(value) => update("whoIsAffected", value)}
            hint="Describe a group broadly, such as residents, riders, or small businesses."
          />
          <TextField
            label="Where does it occur?"
            value={draft.location}
            onChange={(value) => update("location", value)}
            placeholder="A borough, neighborhood, or citywide—not an exact address"
          />
          <TextArea
            label="How do people currently handle it?"
            value={draft.currentWorkaround}
            onChange={(value) => update("currentWorkaround", value)}
          />
          <TextArea
            label="What information or service may help?"
            value={draft.possibleHelp}
            onChange={(value) => update("possibleHelp", value)}
            hint="Software is only one possibility. A guide, research note, or data correction may be better."
          />
          <TextArea
            label="Supporting public sources (optional)"
            value={draft.publicSources}
            onChange={(value) => update("publicSources", value)}
            hint="Use public links only; do not paste private correspondence."
          />
          <label className="flex items-start gap-3 rounded-sm border border-slate-200 p-4 text-sm dark:border-slate-800">
            <input
              type="checkbox"
              checked={draft.wantsToParticipate}
              onChange={(event) => update("wantsToParticipate", event.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-slate-400 text-orange-700 focus:ring-orange-600"
            />
            I’d like to stay involved in researching or shaping this need.
          </label>
        </div>
        <aside className="h-fit rounded-sm border border-slate-200 bg-stone-50 p-5 lg:sticky lg:top-5 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="font-serif text-2xl font-bold text-slate-950 dark:text-stone-50">
            Preview
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
            Submitting a need does not guarantee that a software project will be created.
          </p>
          <pre className="mt-4 max-h-80 overflow-auto rounded-sm bg-slate-950 p-4 text-xs leading-5 whitespace-pre-wrap text-slate-100">
            # {draft.title || "Your civic need"}\n\n{markdown}
          </pre>
          <button
            disabled={!complete}
            type="button"
            onClick={copyMarkdown}
            className="mt-4 w-full rounded-sm border border-orange-700 px-4 py-2.5 text-sm font-bold text-orange-800 hover:bg-orange-50 disabled:cursor-not-allowed disabled:border-slate-300 disabled:text-slate-400 dark:text-orange-300 dark:hover:bg-orange-950/40"
          >
            {copied ? "Copied Markdown" : "Copy Markdown"}
          </button>
          {issueUrl && complete ? (
            <a
              href={issueUrl}
              className="mt-3 block rounded-sm bg-orange-700 px-4 py-2.5 text-center text-sm font-bold text-white hover:bg-orange-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
            >
              Open prefilled GitHub Issue
            </a>
          ) : (
            <p className="mt-3 text-xs leading-5 text-slate-600 dark:text-slate-400">
              A repository owner must set <code>GITHUB_REPOSITORY</code> before a prefilled Issue
              link can be enabled. The Markdown preview remains copyable.
            </p>
          )}
        </aside>
      </form>
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block text-sm font-bold text-slate-800 dark:text-slate-100">
      {label}
      <input
        required
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full rounded-sm border border-slate-300 bg-white px-3 py-2.5 font-normal text-slate-950 outline-offset-2 placeholder:text-slate-400 focus:border-orange-600 focus:outline-2 focus:outline-orange-600 dark:border-slate-700 dark:bg-slate-950 dark:text-stone-50"
      />
    </label>
  );
}
function TextArea({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
}) {
  return (
    <label className="block text-sm font-bold text-slate-800 dark:text-slate-100">
      {label}
      {hint ? (
        <span className="mt-1 block text-xs leading-5 font-normal text-slate-600 dark:text-slate-400">
          {hint}
        </span>
      ) : null}
      <textarea
        required
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        className="mt-2 w-full rounded-sm border border-slate-300 bg-white px-3 py-2.5 font-normal text-slate-950 outline-offset-2 focus:border-orange-600 focus:outline-2 focus:outline-orange-600 dark:border-slate-700 dark:bg-slate-950 dark:text-stone-50"
      />
    </label>
  );
}
