import { formatProjectStatus } from "@/lib/project-presentation";
import type { CivicProject } from "@/lib/registry/schemas";

const styles: Record<CivicProject["status"], string> = {
  proposed: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
  discovery: "bg-sky-100 text-sky-900 dark:bg-sky-950 dark:text-sky-100",
  prototype: "bg-violet-100 text-violet-900 dark:bg-violet-950 dark:text-violet-100",
  pilot: "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-100",
  maintained: "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100",
  "needs-maintainer": "bg-orange-100 text-orange-900 dark:bg-orange-950 dark:text-orange-100",
  paused: "bg-yellow-100 text-yellow-900 dark:bg-yellow-950 dark:text-yellow-100",
  archived: "bg-stone-200 text-stone-700 dark:bg-stone-800 dark:text-stone-200",
};

export function StatusBadge({ status }: { status: CivicProject["status"] }) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${styles[status]}`}>
      {formatProjectStatus(status)}
    </span>
  );
}
