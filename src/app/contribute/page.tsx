import type { Metadata } from "next";
import { ContributionFinder } from "@/app/contribute/contribution-finder";
import { getProjects } from "@/lib/registry/loaders";

export const metadata: Metadata = { title: "Find a contribution" };

export default async function ContributePage() {
  return <ContributionFinder projects={await getProjects()} />;
}
