import type { Task } from "./types";

export const PLACEHOLDER_TASKS: Task[] = [
  { id: "1", title: "Setup project", description: "Init repo and deps", column: "backlog" },
  { id: "2", title: "Auth flow", description: "Login and signup", column: "backlog" },
  { id: "3", title: "API integration", description: "Connect to backend", column: "in_progress" },
  { id: "4", title: "Kanban logic", description: "Drag and drop", column: "in_progress" },
  { id: "5", title: "Code review", description: "PR feedback", column: "review" },
  { id: "6", title: "Deploy", description: "Production release", column: "done" },
];
