import type { Metadata } from "next";
export const metadata: Metadata = { title: "Support" };
export default function SupportPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-12 sm:px-8">
      <h1 className="font-serif text-4xl font-bold text-slate-950 dark:text-stone-50">Support</h1>
      <p className="mt-6 leading-7 text-slate-700 dark:text-slate-300">
        Use a public GitHub discussion or issue for ordinary questions when a repository is
        configured. For conduct, safety, security, or private information concerns, use the channels
        described in <code>SUPPORT.md</code>, <code>SECURITY.md</code>, and{" "}
        <code>CODE_OF_CONDUCT.md</code>.
      </p>
    </div>
  );
}
