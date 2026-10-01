@AGENTS.md

# hire-platform

Turborepo + pnpm monorepo. Next.js app with shadcn/ui (preset `b7Vp9t9TU`, style `base-mira`).

## Product

GetLinks Hire Platform: a Thai-first, LINE-native AI hiring platform. Its core feature is
**application workflows** — a visual builder (rounds → blocks of trigger + actions) that automates the
candidate journey, mocked from Alex's workflow docs. **Build against the PRD** and update it in the
same change if scope moves:

@docs/prd/application-workflows.md

Index of product docs: `docs/prd/README.md`. Requirements are numbered `FR-n`; cite them in commits
and tickets. v1 is native (no ATS sync, no job workflows, no phone calls); see the PRD's phasing.

## Layout

| Path | What |
|---|---|
| `apps/web` | Next.js app (App Router) |
| `packages/ui` | shared shadcn components, `globals.css`, `cn()` util (`@workspace/ui`) |
| `packages/eslint-config`, `packages/typescript-config` | shared configs |

## Commands

```bash
pnpm dev         # all apps via turbo (web on :3000)
pnpm build
pnpm lint
pnpm typecheck
pnpm format
```

## Adding shadcn components

```bash
pnpm dlx shadcn@latest add <component> -c apps/web
```

Components land in `packages/ui/src/components`; import them as
`@workspace/ui/components/<name>`.

Commits use conventional commits (`feat: ...`, `fix(scope): ...`).
