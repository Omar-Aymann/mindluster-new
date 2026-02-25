# Mindluster – Kanban ToDo

A Kanban-style task board built with Next.js, Material UI, and React Query.

## Features

- **4 columns**: Backlog, In Progress, Review, Done
- **CRUD**: Create, edit, delete tasks
- **Drag & drop** between columns (@dnd-kit)
- **Search** by title or description
- **Pagination** with configurable cards per page (3, 5, 10, 20)

## Tech Stack

Next.js 16 · React 19 · MUI · React Query · @dnd-kit

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### API Options

| Mode | Command | Notes |
|------|---------|-------|
| **Next.js API** (default) | `pnpm dev` | Uses built-in `/api/tasks` routes |
| **json-server** | `pnpm mock` (separate terminal), then `pnpm dev` | Set `NEXT_PUBLIC_API_URL=http://localhost:4000` in `.env.local` |

## Deploy (Vercel)

Deploy as usual. Leave `NEXT_PUBLIC_API_URL` unset—the app uses the built-in Next.js API routes.

Data is stored in memory and resets on cold starts. For persistence, connect the API routes to a database.
