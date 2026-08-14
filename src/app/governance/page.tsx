import type { Metadata } from "next";
import { rfcs } from "@/content/rfcs";

export const metadata: Metadata = { title: "Governance" };

export default function GovernancePage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8">
      <p className="text-sm font-bold tracking-[0.15em] text-orange-700 uppercase dark:text-orange-300">
        Public governance
      </p>
      <h1 className="mt-2 font-serif text-4xl font-bold tracking-tight text-slate-950 dark:text-stone-50">
        Decisions should be understandable and reviewable.
      </h1>
      <div className="mt-9 grid gap-5 md:grid-cols-2">
        {[
          [
            "How decisions are made",
            "Meaningful changes use public RFCs, clear discussion windows, and recorded decisions. Day-to-day maintenance is delegated to accountable maintainers.",
          ],
          [
            "Maintainers",
            "Maintainers are selected for sustained, behavior-based stewardship across technical and non-technical work—not commit counts. Selection and removal processes are documented in MAINTAINERS.md.",
          ],
          [
            "Conflict and moderation",
            "Reports are handled through the Code of Conduct and moderation process. Sensitive reports are not published; outcomes are summarized when safe and appropriate.",
          ],
          [
            "Project stages",
            "A need does not automatically become software. Public triage considers alternatives, safety, affected residents, stewardship, and whether the work can be responsibly maintained.",
          ],
          [
            "Pause and archive",
            "Pausing or archiving is responsible maintenance when the reason, limits, and next steps are documented. Lack of commits alone is never grounds to archive.",
          ],
          [
            "Governance changes",
            "Anyone can propose a governance change through the RFC process. Accessibility, privacy, and community impact are required sections.",
          ],
        ].map(([title, copy]) => (
          <section
            key={title}
            className="rounded-sm border border-slate-200 p-5 dark:border-slate-800"
          >
            <h2 className="font-serif text-2xl font-bold text-slate-950 dark:text-stone-50">
              {title}
            </h2>
            <p className="mt-3 leading-7 text-slate-700 dark:text-slate-300">{copy}</p>
          </section>
        ))}
      </div>
      <section className="mt-12">
        <p className="text-sm font-bold tracking-[0.15em] text-orange-700 uppercase dark:text-orange-300">
          Requests for comments
        </p>
        <h2 className="mt-2 font-serif text-3xl font-bold text-slate-950 dark:text-stone-50">
          Public proposals
        </h2>
        {rfcs.map((rfc) => (
          <article
            key={rfc.id}
            className="mt-5 rounded-sm border border-slate-200 p-6 dark:border-slate-800"
          >
            <p className="text-sm font-bold tracking-[0.14em] text-orange-700 uppercase dark:text-orange-300">
              RFC {rfc.id} · {rfc.status}
            </p>
            <h3 className="mt-2 font-serif text-2xl font-bold text-slate-950 dark:text-stone-50">
              {rfc.title}
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Author: {rfc.author}</p>
            <dl className="mt-5 space-y-4 leading-7 text-slate-700 dark:text-slate-300">
              {[
                ["Summary", rfc.summary],
                ["Motivation", rfc.motivation],
                ["Proposal", rfc.proposal],
                ["Alternatives", rfc.alternatives],
                ["Risks", rfc.risks],
                ["Accessibility impact", rfc.accessibilityImpact],
                ["Privacy impact", rfc.privacyImpact],
                ["Community impact", rfc.communityImpact],
                ["Decision", rfc.decision],
                ["Decision date", rfc.decisionDate],
              ].map(([term, definition]) => (
                <div key={term}>
                  <dt className="font-bold text-slate-950 dark:text-stone-50">{term}</dt>
                  <dd>{definition}</dd>
                </div>
              ))}
            </dl>
          </article>
        ))}
      </section>
    </div>
  );
}
