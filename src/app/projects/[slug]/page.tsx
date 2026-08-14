import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DemoBanner } from "@/components/demo-banner";
import { StatusBadge } from "@/components/status-badge";
import { trackLabel } from "@/lib/project-presentation";
import { getProjectBySlug, getProjects } from "@/lib/registry/loaders";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getProjects()).map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const project = await getProjectBySlug((await params).slug);
  return project ? { title: project.name, description: project.tagline } : {};
}

export default async function ProjectPage({ params }: PageProps) {
  const project = await getProjectBySlug((await params).slug);
  if (!project) notFound();
  const repositoryAction = project.repositoryUrl
    ? { href: project.repositoryUrl, label: "View the GitHub repository" }
    : null;
  const meetingAction = project.meetingInfo
    ? { href: project.meetingInfo.publicNotesUrl ?? "#meeting", label: "Attend a meeting" }
    : null;

  return (
    <>
      {project.demo ? <DemoBanner /> : null}
      <section className="border-b border-slate-200 bg-stone-100 px-5 py-12 sm:px-8 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-5xl">
          <Link
            className="rounded-sm text-sm font-bold text-orange-800 underline underline-offset-4 hover:text-orange-950 focus-visible:outline-2 focus-visible:outline-orange-600 dark:text-orange-300"
            href="/projects"
          >
            ← All projects
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <StatusBadge status={project.status} />
            <span className="text-sm font-bold tracking-[0.15em] text-slate-500 uppercase dark:text-slate-400">
              {project.boroughs.join(" · ")}
            </span>
          </div>
          <h1 className="mt-4 font-serif text-5xl font-bold tracking-tight text-slate-950 dark:text-stone-50">
            {project.name}
          </h1>
          <p className="mt-4 max-w-3xl font-serif text-2xl leading-tight text-slate-700 dark:text-slate-200">
            {project.tagline}
          </p>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-700 dark:text-slate-300">
            {project.summary}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              className="rounded-sm bg-orange-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-orange-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
              href="#tasks"
            >
              Make a small contribution
            </a>
            <a
              className="rounded-sm border border-slate-400 px-4 py-2.5 text-sm font-bold text-slate-900 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 dark:text-stone-50 dark:hover:bg-slate-800"
              href="#stewardship"
            >
              Join the project
            </a>
            <a
              className="rounded-sm border border-slate-400 px-4 py-2.5 text-sm font-bold text-slate-900 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 dark:text-stone-50 dark:hover:bg-slate-800"
              href={project.discussionsUrl ?? "mailto:community@fiveboroughcommons.example"}
            >
              Ask a question
            </a>
            {meetingAction ? (
              <a
                className="rounded-sm border border-slate-400 px-4 py-2.5 text-sm font-bold text-slate-900 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 dark:text-stone-50 dark:hover:bg-slate-800"
                href={meetingAction.href}
              >
                {meetingAction.label}
              </a>
            ) : null}
            {repositoryAction ? (
              <a
                className="rounded-sm border border-slate-400 px-4 py-2.5 text-sm font-bold text-slate-900 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 dark:text-stone-50 dark:hover:bg-slate-800"
                href={repositoryAction.href}
                rel="noreferrer"
              >
                {repositoryAction.label}
              </a>
            ) : null}
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-5xl gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[1fr_16rem]">
        <div className="space-y-12">
          <InfoSection title="The resident-facing purpose">
            <p>{project.residentValue}</p>
          </InfoSection>
          <InfoSection title="What problem are we working on?">
            <p>{project.problemStatement}</p>
          </InfoSection>
          <InfoSection title="Current scope">
            <p>{project.currentScope}</p>
          </InfoSection>
          <InfoSection title="Explicit non-goals">
            <ul className="list-disc space-y-2 pl-5">
              {project.nonGoals.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </InfoSection>
          <InfoSection title="Contribution tracks">
            <div className="grid gap-3 sm:grid-cols-2">
              {project.contributionTracks.map((item) => (
                <div
                  key={item.track}
                  className="rounded-sm border border-slate-200 p-4 dark:border-slate-800"
                >
                  <h3 className="font-bold text-slate-950 dark:text-stone-50">
                    {trackLabel[item.track]}
                  </h3>
                  <p className="mt-1 text-sm">{item.description}</p>
                  <p className="mt-3 text-xs font-semibold text-slate-600 dark:text-slate-400">
                    {item.beginnerFriendly ? "Beginner-friendly" : "Experience helpful"} ·{" "}
                    {item.mentorAvailable ? "Mentor available" : "No mentor confirmed"}
                  </p>
                </div>
              ))}
            </div>
          </InfoSection>
          <InfoSection title="Current tasks" id="tasks">
            {project.tasks.length ? (
              <div className="space-y-4">
                {project.tasks.map((task) => (
                  <article
                    id={task.id}
                    key={task.id}
                    className="scroll-mt-6 rounded-sm border border-slate-200 p-5 dark:border-slate-800"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="font-serif text-xl font-bold text-slate-950 dark:text-stone-50">
                        {task.title}
                      </h3>
                      <span className="rounded-full bg-sky-100 px-2 py-1 text-xs font-bold text-sky-900 dark:bg-sky-950 dark:text-sky-100">
                        {task.effort}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6">{task.description}</p>
                    <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                      <div>
                        <dt className="font-bold">Track</dt>
                        <dd>{trackLabel[task.track]}</dd>
                      </div>
                      <div>
                        <dt className="font-bold">Setup</dt>
                        <dd>
                          {task.difficulty === "starter"
                            ? "No local setup required unless noted"
                            : "See task context"}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-bold">Questions</dt>
                        <dd>
                          {task.mentorAvailable
                            ? "A mentor is available"
                            : "Use the project discussion"}
                        </dd>
                      </div>
                    </dl>
                    <h4 className="mt-4 text-sm font-bold">Acceptance criteria</h4>
                    <ul className="mt-1 list-disc pl-5 text-sm">
                      {task.acceptanceCriteria.map((criterion) => (
                        <li key={criterion}>{criterion}</li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            ) : (
              <p>
                No tasks are listed yet. That is a transparent invitation to ask about stewardship
                before beginning work.
              </p>
            )}
          </InfoSection>
          <InfoSection title="Project timeline">
            {project.timeline.length ? (
              <ol className="space-y-4 border-l-2 border-orange-300 pl-5 dark:border-orange-800">
                {project.timeline.map((event) => (
                  <li key={`${event.date}-${event.title}`}>
                    <p className="text-sm font-bold text-orange-800 dark:text-orange-300">
                      {event.date}
                    </p>
                    <h3 className="font-bold text-slate-950 dark:text-stone-50">{event.title}</h3>
                    <p>{event.description}</p>
                  </li>
                ))}
              </ol>
            ) : (
              <p>No timeline entries have been published.</p>
            )}
          </InfoSection>
          <InfoSection title="Data sources">
            {project.dataSources.length ? (
              <ul className="space-y-3">
                {project.dataSources.map((source) => (
                  <li key={source.url}>
                    <a
                      className="font-semibold text-orange-800 underline underline-offset-4 dark:text-orange-300"
                      href={source.url}
                      rel="noreferrer"
                    >
                      {source.name}
                    </a>
                    {source.notes ? <p className="text-sm">{source.notes}</p> : null}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No data sources are represented in this registry entry.</p>
            )}
          </InfoSection>
          <InfoSection title="Limitations">
            <ul className="list-disc space-y-2 pl-5">
              {project.limitations.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </InfoSection>
          <InfoSection title="Impact evidence">
            {project.impactEvidence.length ? (
              <ul className="space-y-3">
                {project.impactEvidence.map((evidence) => (
                  <li key={evidence.evidenceUrl}>
                    <p className="font-semibold">{evidence.claim}</p>
                    <a
                      className="text-orange-800 underline underline-offset-4 dark:text-orange-300"
                      href={evidence.evidenceUrl}
                    >
                      View supporting evidence
                    </a>
                    <p className="text-sm">Measured: {evidence.measuredAt}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>
                No measurable-impact claim is made for this project without public supporting
                evidence.
              </p>
            )}
          </InfoSection>
        </div>
        <aside className="space-y-6 lg:sticky lg:top-5 lg:h-fit">
          <section
            id="stewardship"
            className="rounded-sm border border-slate-200 bg-stone-50 p-5 dark:border-slate-800 dark:bg-slate-900"
          >
            <h2 className="font-serif text-xl font-bold text-slate-950 dark:text-stone-50">
              Stewardship
            </h2>
            <ul className="mt-4 space-y-3">
              {project.maintainers.map((maintainer) => (
                <li key={`${maintainer.displayName}-${maintainer.role}`}>
                  <p className="font-bold text-slate-950 dark:text-stone-50">
                    {maintainer.displayName}
                  </p>
                  <p className="text-sm">{maintainer.role}</p>
                  <p className="mt-1 text-xs font-bold tracking-wide text-orange-800 uppercase dark:text-orange-300">
                    {maintainer.availability.replaceAll("-", " ")}
                  </p>
                </li>
              ))}
            </ul>
            <ul className="mt-5 space-y-2 border-t border-slate-200 pt-4 text-sm dark:border-slate-800">
              {project.stewardship.indicators.map((indicator) => (
                <li key={indicator}>✓ {indicator}</li>
              ))}
            </ul>
          </section>
          <section className="rounded-sm border border-slate-200 p-5 dark:border-slate-800">
            <h2 className="font-serif text-xl font-bold text-slate-950 dark:text-stone-50">
              Project links
            </h2>
            <ul className="mt-3 space-y-2 text-sm">
              {project.roadmapUrl ? (
                <li>
                  <a
                    className="font-semibold text-orange-800 underline underline-offset-4 dark:text-orange-300"
                    href={project.roadmapUrl}
                  >
                    Review the roadmap
                  </a>
                </li>
              ) : (
                <li>No public roadmap link yet.</li>
              )}
              {project.issuesUrl ? (
                <li>
                  <a
                    className="font-semibold text-orange-800 underline underline-offset-4 dark:text-orange-300"
                    href={project.issuesUrl}
                  >
                    View current tasks
                  </a>
                </li>
              ) : null}
            </ul>
          </section>
        </aside>
      </div>
    </>
  );
}

function InfoSection({
  title,
  id,
  children,
}: {
  title: string;
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-6">
      <h2 className="font-serif text-3xl font-bold tracking-tight text-slate-950 dark:text-stone-50">
        {title}
      </h2>
      <div className="mt-4 leading-7 text-slate-700 dark:text-slate-300">{children}</div>
    </section>
  );
}
