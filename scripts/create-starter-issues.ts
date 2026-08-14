import { readFile } from "node:fs/promises";
const apply = process.argv.includes("--apply");
async function main() {
  const backlog = await readFile("docs/starter-issue-backlog.md", "utf8");
  console.log(
    `${apply ? "Apply requested" : "Dry run"}: proposed starter backlog follows.\n${backlog}`,
  );
  if (apply)
    console.log(
      "Remote issue creation is intentionally left for a reviewed maintainer workflow; no issues were created.",
    );
}
void main();
