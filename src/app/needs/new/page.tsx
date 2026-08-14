import type { Metadata } from "next";
import { NeedForm } from "@/app/needs/new/need-form";

export const metadata: Metadata = { title: "Propose a civic need" };

export default function NewNeedPage() {
  return <NeedForm repository={process.env.GITHUB_REPOSITORY} />;
}
