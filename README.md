# pluggy-mcp

## Stack

- **Runtime:** Bun
- **Git hooks:** Husky
- **Commit lint:** commitlint (conventional-changelog config)
- **Commit prompts:** commitizen (cz-conventional-changelog)
- **Commit emojis:** devmoji (auto-adiciona via hook)
- **Secret detection:** secretlint

## Setup

```bash
bun install
```

## Commands

| Command | Description |
|---------|-------------|
| `bun run commit` | Interactive commit via commitizen |
| `bun run devmoji` | Add emoji to a commit message |
| `bun run secretlint` | Scan files for secrets |
| `bun run commitlint` | Validate commit message format |
| `bun run index.ts` | Run the project |

## Git Hooks

- **pre-commit** — runs `secretlint` on staged files
- **commit-msg** — runs `devmoji` (adds emoji based on commit type) then `commitlint` (validates format)

## Commit Convention

Uses [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

feat: add user login
fix: resolve timeout on large payloads
chore: bump dependencies
```

Types: `feat`, `fix`, `chore`, `docs`, `style`, `refactor`, `perf`, `test`, `ci`, `build`.

Use `bun run commit` for an interactive prompt that guides you through the format.

## Devmoji Emoji Map

Every commit gets an emoji automatically via the commit-msg hook. No need to manually add emojis — just write conventional commits and devmoji handles the rest.

| Type | Emoji |
|------|-------|
| `feat` | ✨ |
| `fix` | 🐛 |
| `docs` | 📝 |
| `chore` | 🔧 |
| `refactor` | ♻️ |
| `style` | 💄 |
| `perf` | ⚡ |
| `test` | ✅ |
| `ci` | 👷 |
| `build` | 📦 |

## Secretlint

Secretlint runs on every commit to prevent accidental exposure of credentials, tokens, and keys. Configure rules in `.secretlintrc.json`.

## Publishing to npm

```bash
bun build --target=node --outdir=dist index.ts
npm publish
```

`npx pluggy-mcp` will then work on any machine with Node.js installed.
