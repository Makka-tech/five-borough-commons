import type { Metadata } from "next";
import Link from "next/link";
import { calculateCommunityMetrics } from "@/lib/community/metrics";
import { getContributorProfiles, getEvents, getProjects } from "@/lib/registry/loaders";

export const metadata: Metadata = { title: "Community" };

export default async function CommunityPage() {
  const [projects, events, profiles] = await Promise.all([
    getProjects(),
    getEvents(),
    getContributorProfiles(),
  ]);
  const metrics = calculateCommunityMetrics(projects);
  const visibleProfiles = profiles
    .filter((profile) => profile.showOnCommunityPage)
    .sort((a, b) =>
      (a.displayName ?? a.githubUsername).localeCompare(b.displayName ?? b.githubUsername),
    );
  const realProjects = projects.filter((project) => !project.demo);
  return (
    <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
      <p className="text-sm font-bold tracking-[0.15em] text-orange-700 uppercase dark:text-orange-300">
        Community health
      </p>
      <h1 className="mt-2 font-serif text-4xl font-bold tracking-tight text-slate-950 dark:text-stone-50">
        A public workshop, not a leaderboard.
      </h1>
      <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-700 dark:text-slate-300">
        These transparent measurements describe opportunities and stewardship. They never rank
        people or measure anyone’s worth through commits, followers, lines of code, or hours.
      </p>
      <section className="mt-9 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {metrics.map((metric) => (
          <article
            key={metric.id}
            className="rounded-sm border border-slate-200 bg-stone-50 p-5 dark:border-slate-800 dark:bg-slate-900"
          >
            <p className="font-serif text-4xl font-bold text-orange-800 dark:text-orange-300">
              {metric.value}
            </p>
            <h2 className="mt-1 font-bold text-slate-950 dark:text-stone-50">{metric.label}</h2>
            <dl className="mt-4 space-y-2 text-xs leading-5 text-slate-600 dark:text-slate-400">
              <div>
                <dt className="font-bold">Definition</dt>
                <dd>{metric.definition}</dd>
              </div>
              <div>
                <dt className="font-bold">Time window</dt>
                <dd>{metric.timeWindow}</dd>
              </div>
              <div>
                <dt className="font-bold">Source</dt>
                <dd>{metric.source}</dd>
              </div>
              <div>
                <dt className="font-bold">Known limitation</dt>
                <dd>{metric.limitation}</dd>
              </div>
            </dl>
          </article>
        ))}
      </section>
      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="font-serif text-3xl font-bold text-slate-950 dark:text-stone-50">
            Stewardship needs
          </h2>
          <ul className="mt-4 space-y-3">
            {realProjects
              .filter((project) => project.stewardship.indicators.includes("Seeking co-maintainer"))
              .map((project) => (
                <li
                  key={project.id}
                  className="rounded-sm border border-slate-200 p-4 dark:border-slate-800"
                >
                  <Link
                    className="font-bold text-orange-800 underline underline-offset-4 dark:text-orange-300"
                    href={`/projects/${project.slug}`}
                  >
                    {project.name}
                  </Link>
                  <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                    {project.maintainers[0]?.role}
                  </p>
                </li>
              ))}
          </ul>
        </section>
        <section>
          <h2 className="font-serif text-3xl font-bold text-slate-950 dark:text-stone-50">
            People who opted in
          </h2>
          {visibleProfiles.length ? (
            <ul className="mt-4 space-y-3">
              {visibleProfiles.map((profile) => (
                <li
                  key={profile.githubUsername}
                  className="rounded-sm border border-slate-200 p-4 dark:border-slate-800"
                >
                  <p className="font-bold">{profile.displayName ?? profile.githubUsername}</p>
                  <p className="text-sm">{profile.contributionTracks.join(", ")}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 rounded-sm border border-dashed border-slate-300 p-5 leading-7 text-slate-700 dark:border-slate-700 dark:text-slate-300">
              No contributor profiles are shown. Profiles are opt-in, and this project does not copy
              private GitHub profile information.
            </p>
          )}
        </section>
        <section>
          <h2 className="font-serif text-3xl font-bold text-slate-950 dark:text-stone-50">
            Public meetings
          </h2>
          {events.filter((event) => event.public).length ? (
            <ul className="mt-4">
              {events
                .filter((event) => event.public)
                .map((event) => (
                  <li key={event.id}>{event.title}</li>
                ))}
            </ul>
          ) : (
            <p className="mt-4 rounded-sm border border-dashed border-slate-300 p-5 leading-7 text-slate-700 dark:border-slate-700 dark:text-slate-300">
              No public meetings are currently listed. Attendance is never fabricated.
            </p>
          )}
        </section>
        <section>
          <h2 className="font-serif text-3xl font-bold text-slate-950 dark:text-stone-50">
            Recent releases and first contributions
          </h2>
          <p className="mt-4 rounded-sm border border-dashed border-slate-300 p-5 leading-7 text-slate-700 dark:border-slate-700 dark:text-slate-300">
            No live GitHub snapshot is configured in this local fixture. When configured, releases
            and first contributions will be shown with their documented source and time window.
          </p>
        </section>
      </div>
    </div>
  );
}
