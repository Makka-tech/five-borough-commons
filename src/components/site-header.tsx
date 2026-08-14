import Link from "next/link";
import { en } from "@/content/en";

const links = [
  ["Projects", "/projects"],
  ["Contribute", "/contribute"],
  ["Bring a need", "/needs/new"],
  ["Community", "/community"],
  ["Governance", "/governance"],
] as const;

export function SiteHeader() {
  return (
    <header className="border-b border-slate-200 bg-stone-50 dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <Link
          href="/"
          className="group flex items-center gap-3 rounded-sm text-slate-950 outline-offset-4 focus-visible:outline-2 focus-visible:outline-orange-600 dark:text-stone-50"
        >
          <span className="grid h-9 w-9 place-items-center rounded-sm bg-orange-600 font-serif text-xl font-bold text-white shadow-sm transition-transform group-hover:-rotate-3">
            5
          </span>
          <span>
            <span className="block font-serif text-lg leading-none font-bold tracking-tight">
              {en.siteName}
            </span>
            <span className="mt-1 block text-xs font-medium tracking-[0.16em] text-slate-500 uppercase dark:text-slate-400">
              A public project studio
            </span>
          </span>
        </Link>
        <nav
          aria-label="Primary navigation"
          className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-semibold"
        >
          {links.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="rounded-sm px-1 py-1 text-slate-700 underline-offset-4 hover:text-orange-700 hover:underline focus-visible:outline-2 focus-visible:outline-orange-600 dark:text-slate-200 dark:hover:text-orange-300"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
