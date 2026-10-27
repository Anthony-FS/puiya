# apps

Each app is generated with its official tool in its own pull request, following the plan → build
→ review loop in [CLAUDE.md](../CLAUDE.md):

| Folder   | Created with                   | First PR                                        |
| -------- | ------------------------------ | ----------------------------------------------- |
| `mobile` | `create-expo-app` (TypeScript) | Offline sale screen with barcode scan           |
| `api`    | Fastify + Drizzle              | Shops, products, sales tables and sync endpoint |
| `web`    | `create-next-app`              | Owner sales report                              |

All apps import types, validation and Thai formatting from `@puiya/shared`.
