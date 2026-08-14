import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { parse } from "yaml";
import { ZodError, type z } from "zod";
import {
  civicNeedSchema,
  civicProjectSchema,
  contributorProfileSchema,
  eventSchema,
} from "../src/lib/registry/schemas";

const registryRoot = path.join(process.cwd(), "registry");

type RegistryKind = "projects" | "needs" | "events" | "contributors";
const schemas: Record<RegistryKind, z.ZodType> = {
  projects: civicProjectSchema,
  needs: civicNeedSchema,
  events: eventSchema,
  contributors: contributorProfileSchema,
};

function suggestedCorrection(message: string, field: string): string {
  if (message.includes("YYYY-MM-DD")) return `Use a date such as: ${field}: '2026-08-13'`;
  if (message.includes("valid https:// URL"))
    return `Use an absolute HTTPS URL such as: ${field}: https://example.org`;
  if (message.includes("kebab-case"))
    return `Use lowercase kebab-case, such as: ${field}: my-project`;
  if (message.includes("HTML"))
    return "Remove HTML tags; the registry accepts plain text and Markdown-safe content only.";
  if (message.includes("Unrecognized key"))
    return "Remove the unknown field or add it to the documented registry schema first.";
  if (message.includes("Invalid option"))
    return "Choose one of the documented values from registry/schemas.";
  return "Check registry/schemas for the field shape and update this value.";
}

function formatError(file: string, error: ZodError): string[] {
  return error.issues.map((issue) => {
    const field = issue.path.length ? issue.path.join(".") : "root";
    return `${file}\n  Invalid field: ${field}\n  Expected: ${issue.message}\n  Suggested correction: ${suggestedCorrection(issue.message, field)}`;
  });
}

async function registryFiles(kind: RegistryKind): Promise<string[]> {
  const folder = path.join(registryRoot, kind);
  return (await readdir(folder)).filter((file) => /\.ya?ml$/i.test(file)).sort();
}

async function main() {
  const errors: string[] = [];
  const projectIds = new Set<string>();
  const contributorProfiles: Array<{ file: string; projects: string[] }> = [];
  const eventProjects: Array<{ file: string; projectSlugs: string[] }> = [];

  for (const kind of Object.keys(schemas) as RegistryKind[]) {
    for (const file of await registryFiles(kind)) {
      const filePath = path.join(registryRoot, kind, file);
      const relativePath = path.relative(process.cwd(), filePath);
      try {
        const data = parse(await readFile(filePath, "utf8"));
        const value = schemas[kind].parse(data) as Record<string, unknown>;
        if (kind === "projects") projectIds.add(value.slug as string);
        if (kind === "contributors")
          contributorProfiles.push({ file: relativePath, projects: value.projects as string[] });
        if (kind === "events")
          eventProjects.push({ file: relativePath, projectSlugs: value.projectSlugs as string[] });
      } catch (error) {
        if (error instanceof ZodError) errors.push(...formatError(relativePath, error));
        else
          errors.push(
            `${relativePath}\n  Invalid YAML: ${error instanceof Error ? error.message : String(error)}\n  Suggested correction: Check indentation and YAML syntax.`,
          );
      }
    }
  }

  for (const { file, projects } of contributorProfiles) {
    for (const project of projects.filter((project) => !projectIds.has(project))) {
      errors.push(
        `${file}\n  Invalid field: projects\n  Expected: a project slug present in registry/projects\n  Suggested correction: Replace '${project}' with an existing project slug or create that project first.`,
      );
    }
  }
  for (const { file, projectSlugs } of eventProjects) {
    for (const project of projectSlugs.filter((project) => !projectIds.has(project))) {
      errors.push(
        `${file}\n  Invalid field: projectSlugs\n  Expected: a project slug present in registry/projects\n  Suggested correction: Replace '${project}' with an existing project slug or remove the reference.`,
      );
    }
  }

  if (errors.length) {
    console.error(
      `Registry validation failed with ${errors.length} error${errors.length === 1 ? "" : "s"}:\n\n${errors.join("\n\n")}`,
    );
    process.exitCode = 1;
    return;
  }
  console.log("Registry validation passed: all YAML entries match their schema and references.");
}

void main();
