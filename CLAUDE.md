@AGENTS.md

# hire-platform

Turborepo + pnpm monorepo. Next.js app with shadcn/ui (preset `b7Vp9t9TU`, style `base-mira`).

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
