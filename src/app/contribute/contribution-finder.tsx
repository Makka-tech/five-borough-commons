"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { recommendTasks } from "@/lib/contributions/match";
import { trackLabel } from "@/lib/project-presentation";
import type { CivicProject, ContributionTrack, TimeCommitment } from "@/lib/registry/schemas";

const tracks: ContributionTrack[] = [
  "code",
  "data",
  "design",
  "documentation",
  "translation",
  "accessibility-review",
  "user-research",
  "community-outreach",
  "policy-or-domain-research",
  "testing",
  "project-management",
];
const boroughs = [
  "Any borough",
  "Manhattan",
  "Brooklyn",
  "Queens",
  "The Bronx",
  "Staten Island",
  "Citywide",
] as const;
const times: TimeCommitment[] = ["15 minutes", "1 hour", "2–4 hours", "weekly", "ongoing"];

export function ContributionFinder({ projects }: { projects: CivicProject[] }) {
  const [selectedTracks, setSelectedTracks] = useState<ContributionTrack[]>(["documentation"]);
  const [availableTime, setAvailableTime] = useState<TimeCommitment>("1 hour");
  const [experience, setExperience] = useState<"new" | "some" | "experienced">("new");
  const [borough, setBorough] = useState<(typeof boroughs)[number]>("Any borough");
  const [collaboration, setCollaboration] = useState<"independent" | "collaborative">(
    "independent",
  );
  const recommendations = useMemo(
    () =>
      recommendTasks(projects, {
        tracks: selectedTracks,
        availableTime,
        experience,
        borough: borough === "Any borough" ? undefined : borough,
        collaboration,
      }),
    [availableTime, borough, collaboration, experience, projects, selectedTracks],
  );

  function toggleTrack(track: ContributionTrack) {
    setSelectedTracks((current) =>
      current.includes(track)
        ? current.length === 1
          ? current
          : current.filter((item) => item !== track)
        : [...current, track],
    );
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[22rem_1fr]">
      <form
        className="h-fit rounded-sm border border-slate-200 bg-stone-50 p-5 lg:sticky lg:top-5 dark:border-slate-800 dark:bg-slate-900"
        onSubmit={(event) => event.preventDefault()}
      >
        <h2 className="font-serif text-2xl font-bold text-slate-950 dark:text-stone-50">
          What can you help with?
        </h2>
        <fieldset className="mt-5">
          <legend className="text-sm font-bold">Contribution tracks</legend>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {tracks.map((track) => (
              <label key={track} className="flex items-start gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={selectedTracks.includes(track)}
                  onChange={() => toggleTrack(track)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-400 text-orange-700 focus:ring-orange-600"
                />
                {trackLabel[track]}
              </label>
            ))}
          </div>
        </fieldset>
        <Field label="How much time do you have?">
          <select
            value={availableTime}
            onChange={(event) => setAvailableTime(event.target.value as TimeCommitment)}
          >
            {times.map((time) => (
              <option key={time}>{time}</option>
            ))}
          </select>
        </Field>
        <fieldset className="mt-5">
          <legend className="text-sm font-bold">How experienced are you with open source?</legend>
          <div className="mt-2 space-y-2">
            {(["new", "some", "experienced"] as const).map((item) => (
              <label className="flex gap-2 text-sm" key={item}>
                <input
                  type="radio"
                  name="experience"
                  value={item}
                  checked={experience === item}
                  onChange={() => setExperience(item)}
                  className="mt-0.5 h-4 w-4 border-slate-400 text-orange-700 focus:ring-orange-600"
                />
                {item === "new"
                  ? "New to open source"
                  : item === "some"
                    ? "Some experience"
                    : "Experienced"}
              </label>
            ))}
          </div>
        </fieldset>
        <Field label="Which boroughs interest you?">
          <select
            value={borough}
            onChange={(event) => setBorough(event.target.value as (typeof boroughs)[number])}
          >
            {boroughs.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </Field>
        <fieldset className="mt-5">
          <legend className="text-sm font-bold">Task style</legend>
          <div className="mt-2 space-y-2">
            <label className="flex gap-2 text-sm">
              <input
                type="radio"
                name="collaboration"
                checked={collaboration === "independent"}
                onChange={() => setCollaboration("independent")}
                className="mt-0.5 h-4 w-4 border-slate-400 text-orange-700 focus:ring-orange-600"
              />
              Independent task
            </label>
            <label className="flex gap-2 text-sm">
              <input
                type="radio"
                name="collaboration"
                checked={collaboration === "collaborative"}
                onChange={() => setCollaboration("collaborative")}
                className="mt-0.5 h-4 w-4 border-slate-400 text-orange-700 focus:ring-orange-600"
              />
              Collaborative task
            </label>
          </div>
        </fieldset>
        <p className="mt-5 border-t border-slate-200 pt-4 text-xs leading-5 text-slate-600 dark:border-slate-800 dark:text-slate-400">
          Matching uses only the choices on this page and committed task metadata. It does not
          inspect or infer anything from a GitHub profile.
        </p>
      </form>
      <section aria-live="polite" aria-atomic="true">
        <p className="text-sm font-bold tracking-[0.15em] text-orange-700 uppercase dark:text-orange-300">
          Deterministic matches
        </p>
        <h1 className="mt-2 font-serif text-4xl font-bold tracking-tight text-slate-950 dark:text-stone-50">
          Recommended contributions
        </h1>
        <p className="mt-3 max-w-2xl leading-7 text-slate-700 dark:text-slate-300">
          Here are up to six tasks that fit the information you selected. Recommendations are
          explainable—not AI-generated.
        </p>
        <div className="mt-7 space-y-5">
          {recommendations.map(({ project, task, reasons }) => (
            <article
              key={`${project.id}-${task.id}`}
              className="rounded-sm border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex flex-wrap justify-between gap-3">
                <div>
                  <p className="text-xs font-bold tracking-[0.15em] text-orange-700 uppercase dark:text-orange-300">
                    {project.name} · {task.effort}
                  </p>
                  <h2 className="mt-2 font-serif text-2xl font-bold text-slate-950 dark:text-stone-50">
                    {task.title}
                  </h2>
                </div>
                <span className="h-fit rounded-full bg-sky-100 px-2.5 py-1 text-xs font-bold text-sky-900 dark:bg-sky-950 dark:text-sky-100">
                  {trackLabel[task.track]}
                </span>
              </div>
              <p className="mt-3 leading-7 text-slate-700 dark:text-slate-300">
                {task.description}
              </p>
              <h3 className="mt-5 text-sm font-bold text-slate-950 dark:text-stone-50">
                Recommended because:
              </h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-slate-700 dark:text-slate-300">
                {reasons.map((reason) => (
                  <li key={reason}>{reason}</li>
                ))}
              </ul>
              <Link
                className="mt-5 inline-block rounded-sm border border-orange-700 px-4 py-2 text-sm font-bold text-orange-800 hover:bg-orange-50 focus-visible:outline-2 focus-visible:outline-orange-600 dark:text-orange-300 dark:hover:bg-orange-950/40"
                href={`/projects/${project.slug}#${task.id}`}
              >
                View task details
              </Link>
            </article>
          ))}
        </div>
        {recommendations.length === 0 ? (
          <div className="mt-7 rounded-sm border border-dashed border-slate-300 p-8 text-center dark:border-slate-700">
            <h2 className="font-serif text-2xl font-bold text-slate-950 dark:text-stone-50">
              No exact task match yet.
            </h2>
            <p className="mt-2 text-slate-700 dark:text-slate-300">
              Try a little more available time, a different task style, or{" "}
              <Link
                href="/needs/new"
                className="font-bold text-orange-800 underline dark:text-orange-300"
              >
                bring a need
              </Link>{" "}
              that is not represented.
            </p>
          </div>
        ) : null}
      </section>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="mt-5 block text-sm font-bold">
      {label}
      <span className="mt-1 block [&_select]:w-full [&_select]:rounded-sm [&_select]:border [&_select]:border-slate-300 [&_select]:bg-white [&_select]:px-3 [&_select]:py-2 [&_select]:text-sm [&_select]:font-normal [&_select]:text-slate-950 [&_select]:outline-offset-2 [&_select]:focus:border-orange-600 [&_select]:focus:outline-2 [&_select]:focus:outline-orange-600 dark:[&_select]:border-slate-700 dark:[&_select]:bg-slate-950 dark:[&_select]:text-stone-50">
        {children}
      </span>
    </label>
  );
}
