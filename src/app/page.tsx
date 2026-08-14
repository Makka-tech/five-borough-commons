import Link from "next/link";
import { ProjectCard } from "@/components/project-card";
import { en } from "@/content/en";
import { getProjects } from "@/lib/registry/loaders";

export default async function HomePage() {
  const projects = await getProjects();
  const core = projects.filter((project) => !project.demo).slice(0, 3);
  const starterTasks = projects.flatMap((project) =>
    project.tasks
      .filter((task) => task.difficulty === "starter")
      .map((task) => ({ project, task })),
  );

  return (
    <>
      <section className="border-b border-slate-200 bg-[radial-gradient(circle_at_top_left,_#fed7aa,_transparent_32rem),linear-gradient(130deg,_#fff7ed,_#fafaf9_55%,_#e0f2fe)] px-5 py-18 sm:px-8 sm:py-24 dark:border-slate-800 dark:bg-[radial-gradient(circle_at_top_left,_#7c2d12,_transparent_32rem),linear-gradient(130deg,_#1c1917,_#020617_55%,_#0c4a6e)]">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold tracking-[0.18em] text-orange-800 uppercase dark:text-orange-300">
            Open-source civic project incubator · New York City
          </p>
          <h1 className="mt-5 max-w-4xl font-serif text-5xl leading-[0.98] font-bold tracking-tight text-slate-950 sm:text-7xl dark:text-stone-50">
            Five Borough Commons
          </h1>
          <p className="mt-6 max-w-2xl font-serif text-2xl leading-tight text-slate-800 sm:text-3xl dark:text-slate-100">
            Build useful things with New Yorkers.
          </p>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-700 dark:text-slate-300">
            Find a civic project, bring a neighborhood need, or make your first open-source
            contribution.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              className="rounded-sm bg-orange-700 px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-orange-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
              href="/contribute"
            >
              Find a contribution
            </Link>
            <Link
              className="rounded-sm border border-slate-400 bg-white/70 px-5 py-3 text-sm font-bold text-slate-900 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 dark:border-slate-500 dark:bg-slate-950/70 dark:text-stone-50 dark:hover:bg-slate-900"
              href="/projects"
            >
              Explore projects
            </Link>
            <Link
              className="rounded-sm border border-slate-400 bg-white/70 px-5 py-3 text-sm font-bold text-slate-900 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 dark:border-slate-500 dark:bg-slate-950/70 dark:text-stone-50 dark:hover:bg-slate-900"
              href="/needs/new"
            >
              Propose a civic need
            </Link>
          </div>
          <p className="mt-7 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">
            {en.independentNotice}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold tracking-[0.15em] text-orange-700 uppercase dark:text-orange-300">
              Open project studio
            </p>
            <h2 className="mt-2 font-serif text-3xl font-bold tracking-tight text-slate-950 dark:text-stone-50">
              Projects with a public purpose
            </h2>
          </div>
          <Link
            className="font-semibold text-orange-800 underline underline-offset-4 hover:text-orange-950 focus-visible:outline-2 focus-visible:outline-orange-600 dark:text-orange-300 dark:hover:text-orange-100"
            href="/projects"
          >
            View all projects <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {core.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-sky-50 px-5 py-16 sm:px-8 dark:border-slate-800 dark:bg-sky-950/30">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold tracking-[0.15em] text-sky-800 uppercase dark:text-sky-300">
            Start small
          </p>
          <h2 className="mt-2 font-serif text-3xl font-bold tracking-tight text-slate-950 dark:text-stone-50">
            Beginner-friendly tasks
          </h2>
          <p className="mt-3 max-w-2xl leading-7 text-slate-700 dark:text-slate-300">
            Useful contributions include writing, research, accessibility review, testing,
            translation, and community care—not just code.
          </p>
          <div className="mt-7 grid gap-4 md:grid-cols-2">
            {starterTasks.map(({ project, task }) => (
              <Link
                key={task.id}
                href={`/projects/${project.slug}#${task.id}`}
                className="rounded-sm border border-sky-200 bg-white p-5 shadow-sm hover:border-sky-400 focus-visible:outline-2 focus-visible:outline-orange-600 dark:border-sky-900 dark:bg-slate-900"
              >
                <span className="text-xs font-bold tracking-[0.15em] text-sky-800 uppercase dark:text-sky-300">
                  {task.effort} · {project.name}
                </span>
                <h3 className="mt-2 font-serif text-xl font-bold text-slate-950 dark:text-stone-50">
                  {task.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
                  {task.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <p className="text-sm font-bold tracking-[0.15em] text-orange-700 uppercase dark:text-orange-300">
          A responsible path
        </p>
        <h2 className="mt-2 font-serif text-3xl font-bold tracking-tight text-slate-950 dark:text-stone-50">
          From a need to a maintained public resource
        </h2>
        <ol className="mt-8 grid gap-4 md:grid-cols-3 lg:grid-cols-6">
          {[
            "Resident need",
            "Community research",
            "Scoped proposal",
            "GitHub issues",
            "Active project",
            "Maintained resource",
          ].map((step, index) => (
            <li
              key={step}
              className="rounded-sm border-l-4 border-orange-600 bg-stone-100 p-4 dark:bg-slate-900"
            >
              <span className="text-xs font-bold text-orange-800 dark:text-orange-300">
                0{index + 1}
              </span>
              <p className="mt-2 text-sm font-bold text-slate-900 dark:text-slate-100">{step}</p>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
