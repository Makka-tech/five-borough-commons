import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import {
  civicNeedSchema,
  civicProjectSchema,
  contributorProfileSchema,
  eventSchema,
} from "../src/lib/registry/schemas";

const outputDirectory = path.join(process.cwd(), "registry", "schemas");
const schemas = {
  "project.schema.json": civicProjectSchema,
  "need.schema.json": civicNeedSchema,
  "event.schema.json": eventSchema,
  "contributor.schema.json": contributorProfileSchema,
} as const;

async function main() {
  await mkdir(outputDirectory, { recursive: true });
  for (const [file, schema] of Object.entries(schemas)) {
    const jsonSchema = z.toJSONSchema(schema, { target: "draft-2020-12" });
    await writeFile(path.join(outputDirectory, file), `${JSON.stringify(jsonSchema, null, 2)}\n`);
  }
  console.log(`Generated ${Object.keys(schemas).length} JSON Schemas in registry/schemas.`);
}

void main();
