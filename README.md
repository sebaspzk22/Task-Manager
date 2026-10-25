# Task-Manager

MVP de gestor de tareas para un solo usuario: API REST (Express + SQLite) y SPA (React + Vite + Tailwind).

## Requisitos
- Node.js 20+

## Uso
```bash
npm install
npm run dev        # API en :3001, web en http://localhost:5173 (proxy /api → :3001)
```

| Script | Descripción |
| --- | --- |
| `npm run dev` | API y web en modo desarrollo |
| `npm test` | Tests de API (Vitest + Supertest) y de UI (Testing Library) |
| `npm run lint` / `npm run typecheck` | ESLint / TypeScript |
| `npm run build` | Compila API (`apps/api/dist`) y web (`apps/web/dist`) |

Variables de la API: `PORT` (3001), `DB_FILE` (`tasks.db`).

## API
| Método | Ruta | Descripción |
| --- | --- | --- |
| GET | `/api/tasks?status=&priority=&q=&sort=` | Lista con filtros; `sort` = `createdAt` \| `dueDate` \| `priority` |
| POST | `/api/tasks` | Crea (`title` obligatorio) |
| GET | `/api/tasks/:id` | Detalle |
| PATCH | `/api/tasks/:id` | Actualización parcial |
| DELETE | `/api/tasks/:id` | Elimina |

Tarea: `{ id, title, description, status: todo|in_progress|done, priority: low|medium|high, dueDate: YYYY-MM-DD|null, createdAt, updatedAt }`.

## Estructura
```
apps/api   routes → services → SQLite (better-sqlite3), validación con Zod
apps/web   React + TanStack Query; vistas Lista y Kanban (drag & drop)
```
