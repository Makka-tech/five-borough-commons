import Link from "next/link";
import { DemoBanner } from "@/components/demo-banner";
import { StatusBadge } from "@/components/status-badge";
import { trackLabel } from "@/lib/project-presentation";
import type { CivicProject } from "@/lib/registry/schemas";

export function ProjectCard({ project }: { project: CivicProject }) {
  const activeTasks = project.tasks.length;
  return (
    <article className="overflow-hidden rounded-sm border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      {project.demo ? <DemoBanner /> : null}
      <div className="p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <StatusBadge status={project.status} />
          <span className="text-xs font-bold tracking-[0.14em] text-slate-500 uppercase dark:text-slate-400">
            {project.boroughs.join(" · ")}
          </span>
        </div>
        <h2 className="mt-4 font-serif text-2xl font-bold tracking-tight text-slate-950 dark:text-stone-50">
          <Link
            className="rounded-sm underline-offset-4 hover:text-orange-700 hover:underline focus-visible:outline-2 focus-visible:outline-orange-600 dark:hover:text-orange-300"
            href={`/projects/${project.slug}`}
          >
            {project.name}
          </Link>
        </h2>
        <p className="mt-2 text-sm font-semibold text-orange-800 dark:text-orange-300">
          {project.tagline}
        </p>
        <p className="mt-4 text-sm leading-6 text-slate-700 dark:text-slate-300">
          {project.summary}
        </p>
        <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 text-sm dark:border-slate-800">
          <div>
            <dt className="font-semibold text-slate-500 dark:text-slate-400">Stewardship</dt>
            <dd className="mt-1 text-slate-800 dark:text-slate-200">
              {project.maintainers.map((maintainer) => maintainer.displayName).join(", ")}
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-500 dark:text-slate-400">Contribution needs</dt>
            <dd className="mt-1 text-slate-800 dark:text-slate-200">
              {activeTasks > 0
                ? `${activeTasks} open task${activeTasks === 1 ? "" : "s"}`
                : "No tasks listed yet"}
            </dd>
          </div>
        </dl>
        <div className="mt-5 flex flex-wrap gap-2" aria-label="Contribution tracks">
          {project.contributionTracks.slice(0, 3).map(({ track }) => (
            <span
              key={track}
              className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              {trackLabel[track]}
            </span>
          ))}
        </div>
        <p className="mt-5 text-sm text-slate-600 dark:text-slate-400">
          <span className="font-semibold">Next:</span>{" "}
          {project.nextMilestone ?? "No public milestone has been set."}
        </p>
      </div>
    </article>
  );
}
