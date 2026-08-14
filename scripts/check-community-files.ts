import { access } from "node:fs/promises";
import path from "node:path";

const required = [
  "README.md",
  "CONTRIBUTING.md",
  "CODE_OF_CONDUCT.md",
  "GOVERNANCE.md",
  "MAINTAINERS.md",
  "COMMUNITY_GUIDE.md",
  "SECURITY.md",
  "SUPPORT.md",
  "PRIVACY.md",
  "LICENSE",
  "LICENSE-CONTENT.md",
  "CHANGELOG.md",
  ".github/CODEOWNERS",
];
async function main() {
  const missing = (
    await Promise.all(
      required.map(async (file) => {
        try {
          await access(path.join(process.cwd(), file));
          return undefined;
        } catch {
          return file;
        }
      }),
    )
  ).filter(Boolean);
  if (missing.length) {
    console.error(`Missing community files: ${missing.join(", ")}`);
    process.exitCode = 1;
  } else console.log("Community files check passed.");
}
void main();
