import { en } from "@/content/en";

export function DemoBanner() {
  return (
    <p className="border-y border-amber-300 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-950 dark:border-amber-700 dark:bg-amber-950/50 dark:text-amber-100">
      <span aria-hidden="true">✦ </span>
      {en.demoNotice}
    </p>
  );
}
