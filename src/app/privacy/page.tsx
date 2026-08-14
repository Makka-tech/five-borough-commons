import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy" };
export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-12 sm:px-8">
      <h1 className="font-serif text-4xl font-bold text-slate-950 dark:text-stone-50">
        Privacy and safety
      </h1>
      <div className="mt-7 space-y-6 leading-7 text-slate-700 dark:text-slate-300">
        <p>
          Five Borough Commons has no resident accounts, analytics, advertising, or trackers by
          default. Registry content is committed public metadata; the site may display public GitHub
          data only through a generated snapshot.
        </p>
        <p>
          Do not enter exact home addresses or sensitive personal information in a civic need.
          Contributors can opt out of local profile display, and the site never copies private
          GitHub profile data.
        </p>
        <p>
          Deployment providers may retain ordinary operational logs. Moderation reports and
          sensitive submissions must be handled through the private reporting process described in{" "}
          <code>docs/moderation.md</code>.
        </p>
      </div>
    </div>
  );
}
