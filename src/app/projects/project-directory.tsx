"use client";

import { useMemo, useState } from "react";
import { ProjectCard } from "@/components/project-card";
import { trackLabel } from "@/lib/project-presentation";
import type { CivicProject } from "@/lib/registry/schemas";

const boroughs = [
  "All boroughs",
  "Manhattan",
  "Brooklyn",
  "Queens",
  "The Bronx",
  "Staten Island",
  "Citywide",
] as const;
const statuses = [
  "All statuses",
  "proposed",
  "discovery",
  "prototype",
  "pilot",
  "maintained",
  "needs-maintainer",
  "paused",
  "archived",
] as const;
const timeOptions = ["Any time", "15 minutes", "1 hour", "2–4 hours", "weekly", "ongoing"] as const;

export function ProjectDirectory({ projects }: { projects: CivicProject[] }) {
  const [borough, setBorough] = useState<(typeof boroughs)[number]>("All boroughs");
  const [status, setStatus] = useState<(typeof statuses)[number]>("All statuses");
  const [track, setTrack] = useState("All contribution tracks");
  const [time, setTime] = useState<(typeof timeOptions)[number]>("Any time");
  const [beginnerOnly, setBeginnerOnly] = useState(false);
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [seekingMaintainer, setSeekingMaintainer] = useState(false);
  const [query, setQuery] = useState("");

  const availableTracks = useMemo(
    () =>
      [
        ...new Set(
          projects.flatMap((project) => project.contributionTracks.map((item) => item.track)),
        ),
      ].sort(),
    [projects],
  );
  const results = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return projects.filter((project) => {
      const haystack = [
        project.name,
        project.tagline,
        project.summary,
        project.skills.join(" "),
        project.neighborhoods?.join(" ") ?? "",
      ]
        .join(" ")
        .toLowerCase();
      return (
        (borough === "All boroughs" || project.boroughs.includes(borough)) &&
        (status === "All statuses" || project.status === status) &&
        (track === "All contribution tracks" ||
          project.contributionTracks.some((item) => item.track === track)) &&
        (time === "Any time" || project.timeCommitments.includes(time)) &&
        (!beginnerOnly || project.contributionTracks.some((item) => item.beginnerFriendly)) &&
        (!remoteOnly || project.participation.includes("remote")) &&
        (!seekingMaintainer ||
          project.status === "needs-maintainer" ||
          project.stewardship.indicators.includes("Seeking co-maintainer")) &&
        (!normalizedQuery || haystack.includes(normalizedQuery))
      );
    });
  }, [beginnerOnly, borough, projects, query, remoteOnly, seekingMaintainer, status, time, track]);

  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[17rem_1fr]">
      <aside
        aria-label="Project filters"
        className="h-fit rounded-sm border border-slate-200 bg-stone-50 p-5 lg:sticky lg:top-5 dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-serif text-xl font-bold text-slate-950 dark:text-stone-50">
            Find your place
          </h2>
          <button
            type="button"
            onClick={() => {
              setBorough("All boroughs");
              setStatus("All statuses");
              setTrack("All contribution tracks");
              setTime("Any time");
              setBeginnerOnly(false);
              setRemoteOnly(false);
              setSeekingMaintainer(false);
              setQuery("");
            }}
            className="rounded-sm text-xs font-bold text-orange-800 underline underline-offset-2 hover:text-orange-950 focus-visible:outline-2 focus-visible:outline-orange-600 dark:text-orange-300"
          >
            Clear
          </button>
        </div>
        <div className="mt-5 space-y-4">
          <label className="block text-sm font-bold text-slate-800 dark:text-slate-100">
            Search projects
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="mt-1 w-full rounded-sm border border-slate-300 bg-white px-3 py-2 text-sm font-normal text-slate-950 outline-offset-2 focus:border-orange-600 focus:outline-2 focus:outline-orange-600 dark:border-slate-700 dark:bg-slate-950 dark:text-stone-50"
              placeholder="Data, Queens, research…"
            />
          </label>
          <FilterSelect label="Borough" value={borough} onChange={setBorough} options={boroughs} />
          <FilterSelect
            label="Project stage"
            value={status}
            onChange={setStatus}
            options={statuses.map((item) =>
              item === "All statuses" ? item : item.replaceAll("-", " "),
            )}
            valueOptions={statuses}
          />
          <FilterSelect
            label="Contribution track"
            value={track}
            onChange={setTrack}
            options={[
              "All contribution tracks",
              ...availableTracks.map((item) => trackLabel[item]),
            ]}
            valueOptions={["All contribution tracks", ...availableTracks]}
          />
          <FilterSelect
            label="Available time"
            value={time}
            onChange={setTime}
            options={timeOptions}
          />
          <fieldset className="space-y-3 border-t border-slate-200 pt-4 dark:border-slate-800">
            <legend className="text-sm font-bold text-slate-800 dark:text-slate-100">
              Participation
            </legend>
            <Check
              label="Beginner-friendly tasks"
              checked={beginnerOnly}
              onChange={setBeginnerOnly}
            />
            <Check label="Remote participation" checked={remoteOnly} onChange={setRemoteOnly} />
            <Check
              label="Seeking a maintainer"
              checked={seekingMaintainer}
              onChange={setSeekingMaintainer}
            />
          </fieldset>
        </div>
      </aside>
      <section aria-live="polite" aria-atomic="true">
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
          {results.length} {results.length === 1 ? "project" : "projects"} match your filters.
        </p>
        <div className="mt-4 grid gap-5 xl:grid-cols-2">
          {results.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
        {results.length === 0 ? (
          <div className="mt-5 rounded-sm border border-dashed border-slate-300 p-8 text-center dark:border-slate-700">
            <h2 className="font-serif text-2xl font-bold text-slate-950 dark:text-stone-50">
              No project matches those filters yet.
            </h2>
            <p className="mt-2 text-slate-700 dark:text-slate-300">
              Try broadening a filter, or bring a community need that is not represented.
            </p>
          </div>
        ) : null}
      </section>
    </div>
  );
}

function FilterSelect<T extends string>({
  label,
  value,
  onChange,
  options,
  valueOptions,
}: {
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: readonly string[];
  valueOptions?: readonly T[];
}) {
  const values = valueOptions ?? (options as readonly T[]);
  return (
    <label className="block text-sm font-bold text-slate-800 dark:text-slate-100">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
        className="mt-1 w-full rounded-sm border border-slate-300 bg-white px-3 py-2 text-sm font-normal text-slate-950 outline-offset-2 focus:border-orange-600 focus:outline-2 focus:outline-orange-600 dark:border-slate-700 dark:bg-slate-950 dark:text-stone-50"
      >
        {options.map((option, index) => (
          <option value={values[index]} key={values[index]}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function Check({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
      <input
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        type="checkbox"
        className="mt-0.5 h-4 w-4 rounded border-slate-400 text-orange-700 focus:ring-orange-600"
      />
      {label}
    </label>
  );
}
