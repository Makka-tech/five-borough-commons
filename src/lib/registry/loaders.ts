import "server-only";

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { parse } from "yaml";
import {
  civicNeedSchema,
  civicProjectSchema,
  contributorProfileSchema,
  eventSchema,
  type CivicNeed,
  type CivicProject,
  type CommunityEvent,
  type ContributorProfile,
} from "@/lib/registry/schemas";
import type { z } from "zod";

const registryRoot = path.join(process.cwd(), "registry");

async function readRegistry<T extends z.ZodType>(
  directory: string,
  schema: T,
): Promise<z.output<T>[]> {
  const folder = path.join(registryRoot, directory);
  const files = (await readdir(folder)).filter((file) => /\.ya?ml$/i.test(file)).sort();
  return Promise.all(
    files.map(async (file) => {
      const filePath = path.join(folder, file);
      const value = parse(await readFile(filePath, "utf8"));
      return schema.parse(value);
    }),
  );
}

export async function getProjects(): Promise<CivicProject[]> {
  return readRegistry("projects", civicProjectSchema);
}

export async function getProjectBySlug(slug: string): Promise<CivicProject | undefined> {
  return (await getProjects()).find((project) => project.slug === slug);
}

export async function getNeeds(): Promise<CivicNeed[]> {
  return readRegistry("needs", civicNeedSchema);
}

export async function getEvents(): Promise<CommunityEvent[]> {
  return readRegistry("events", eventSchema);
}

export async function getContributorProfiles(): Promise<ContributorProfile[]> {
  return readRegistry("contributors", contributorProfileSchema);
}
