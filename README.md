# Five Borough Commons

Five Borough Commons is a GitHub-native civic technology project incubator for New York City. It helps residents articulate needs, contributors find meaningful work, and small projects develop responsible maintainer communities.

> Five Borough Commons is an independent, community-built open-source project. It is not affiliated with or endorsed by the City of New York.

## Who is it for?

Residents, developers, designers, researchers, translators, data analysts, writers, testers, maintainers, and community groups. Non-code work is a first-class contribution.

## How it works

Resident need → community research → scoped proposal → GitHub issues → prototype → active project → maintained public resource. A need does not automatically become a software project.

## Explore, contribute, propose

- Browse `/projects` for committed project metadata and transparent stewardship context.
- Use `/contribute` for deterministic, explainable task matching.
- Use `/needs/new` to make a privacy-aware Markdown preview and, when `GITHUB_REPOSITORY` is configured, a prefilled GitHub Issue.
- Read `/governance` for the lifecycle and sample RFC process.

## Repository architecture

`registry/` is curated public metadata; `src/lib/registry/` contains Zod schemas; `public/generated/community-snapshot.json` is the static GitHub fixture/snapshot; `docs/` contains community operations; `templates/civic-project/` is a reusable starter.

## Local development

Node **24 LTS** is required (see `.nvmrc` and `package.json`).

```bash
git clone <your-fork-url>
cd five-borough-commons
npm install
npm run dev
```

## GitHub synchronization

The site uses a committed snapshot by default. Set server-side `GITHUB_TOKEN`, `GITHUB_ORG`, and/or `GITHUB_REPOSITORY=owner/repo` before running `npm run sync:github`. No token is sent to the browser. See the current [GitHub REST repository documentation](https://docs.github.com/en/rest/repos) and [Discussions GraphQL guide](https://docs.github.com/en/graphql/guides/using-the-graphql-api-for-discussions).

## Testing

Run `npm run format:check`, `npm run lint`, `npm run typecheck`, `npm run validate:registry`, `npm run test`, and `npm run build`. Playwright checks are available through `npm run test:e2e` after browser installation.

## Privacy and licensing

No analytics, advertising, or resident accounts are included. Do not submit sensitive information. Original code is MIT-licensed; documentation and registry content are CC BY 4.0; see `LICENSE` and `LICENSE-CONTENT.md`.

## Roadmap and acknowledgments

The committed implementation covers a static registry, project pages, contribution matching, need drafting, and governance foundations. See `docs/launch-plan.md` for a responsible launch plan. This project draws on open-source civic-tech practices without claiming partnerships or endorsements.
