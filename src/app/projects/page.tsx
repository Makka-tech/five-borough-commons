import type { Metadata } from "next";
import { ProjectDirectory } from "@/app/projects/project-directory";
import { getProjects } from "@/lib/registry/loaders";

export const metadata: Metadata = { title: "Projects" };

export default async function ProjectsPage() {
  const projects = await getProjects();
  return (
    <>
      <section className="border-b border-slate-200 bg-stone-100 px-5 py-12 sm:px-8 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold tracking-[0.15em] text-orange-700 uppercase dark:text-orange-300">
            Project directory
          </p>
          <h1 className="mt-2 font-serif text-4xl font-bold tracking-tight text-slate-950 dark:text-stone-50">
            Useful work, with honest context.
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-7 text-slate-700 dark:text-slate-300">
            Browse public projects by neighborhood, contribution type, time, and stewardship need.
            Activity is never a substitute for clear purpose or accountable maintenance.
          </p>
        </div>
      </section>
      <ProjectDirectory projects={projects} />
    </>
  );
}
