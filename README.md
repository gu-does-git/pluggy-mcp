# pluggy-mcp

MCP server for **Pluggy** — Open Finance Brasil aggregator (ITP/TPP).

Baseado no [`@codespar/mcp-pluggy`](https://www.npmjs.com/package/@codespar/mcp-pluggy) por [CodeSpar](https://codespar.dev), estendido com funcionalidades adicionais.

> **Licença:** MIT — mantém os créditos ao trabalho original da CodeSpar.

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
| `bun run build` | Compila para Node.js (`dist/index.js`) |
| `bun run start` | Roda o servidor MCP (`node dist/index.js`) |
| `bun run secretlint` | Scan files for secrets |
| `bun run commitlint` | Validate commit message format |

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

## Créditos

Este projeto é um fork estendido do [`@codespar/mcp-pluggy`](https://www.npmjs.com/package/@codespar/mcp-pluggy) (MIT), mantendo toda a funcionalidade original dos 16 tools MCP para a API Pluggy. Agradecimentos à [CodeSpar](https://codespar.dev) pelo trabalho base.

### Extensões em relação ao original

- `list_investments` — recupera todos os investimentos de um item (endpoint `GET /investments`)
- `get_investment` — recupera um investimento específico por ID (`GET /investments/{id}`)

## Funcionalidades Originais (16 tools)

| Tool | Pluggy endpoint | Descrição |
|---|---|---|
| `list_connectors` | `GET /connectors` | Lista conectores (bancos) |
| `get_connector` | `GET /connectors/{id}` | Detalhes de um conector |
| `list_categories` | `GET /categories` | Taxonomia de categorias |
| `create_connect_token` | `POST /connect_token` | Token para Pluggy Connect |
| `create_item` | `POST /items` | Nova conexão bancária |
| `list_items` | `GET /items` | Lista conexões |
| `get_item` | `GET /items/{id}` | Detalhes de uma conexão |
| `update_item` | `PATCH /items/{id}` | Atualiza credenciais/sync |
| `delete_item` | `DELETE /items/{id}` | Revoga conexão |
| `list_accounts` | `GET /accounts` | Contas de um item |
| `get_account` | `GET /accounts/{id}` | Detalhes de uma conta |
| `list_transactions` | `GET /transactions` | Transações de uma conta |
| `get_transaction` | `GET /transactions/{id}` | Detalhes de uma transação |
| `list_identities` | `GET /identity` | Dados cadastrais (CPF, nome, endereço) |
| `create_payment_intent` | `POST /payments/intents` | Inicia intent de pagamento |
| `get_payment_intent` | `GET /payments/intents/{id}` | Status do payment intent |

## Publicação

```bash
bun run build
npm publish
```

`npx pluggy-mcp` funcionará em qualquer máquina com Node.js instalado.

## License

MIT — see [LICENSE](LICENSE).
