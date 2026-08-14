import Link from "next/link";
import { en } from "@/content/en";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-slate-200 dark:border-slate-800">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:px-8 md:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="font-serif text-xl font-bold text-stone-50">{en.siteName}</p>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">{en.independentNotice}</p>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <Link
            className="rounded-sm underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-orange-400"
            href="/privacy"
          >
            Privacy
          </Link>
          <Link
            className="rounded-sm underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-orange-400"
            href="/governance"
          >
            Governance
          </Link>
          <a
            className="rounded-sm underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-orange-400"
            href="https://github.com"
            rel="noreferrer"
          >
            GitHub
          </a>
          <Link
            className="rounded-sm underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-orange-400"
            href="/support"
          >
            Support
          </Link>
        </div>
      </div>
    </footer>
  );
}
