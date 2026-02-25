/**
 * In-memory task store for Vercel serverless.
 * Data resets on cold starts; for persistence use a database.
 */
import type { Task } from "./tasks-api";

const initialState: Task[] = [
  { id: "1", title: "Design homepage", description: "Include hero section", column: "backlog" },
  { id: "2", title: "Setup project", description: "Init repo and deps", column: "backlog" },
  { id: "3", title: "Auth flow", description: "Login and signup", column: "backlog" },
  { id: "4", title: "API integration", description: "Connect to backend", column: "in_progress" },
  { id: "5", title: "Kanban logic", description: "Drag and drop", column: "in_progress" },
  { id: "6", title: "Code review", description: "PR feedback", column: "review" },
  { id: "7", title: "Deploy", description: "Production release", column: "done" },
];

let tasks: Task[] = [...initialState];

export function getTasks(): Task[] {
  return [...tasks];
}

export function getTaskById(id: string): Task | undefined {
  return tasks.find((t) => t.id === id);
}

export function createTask(task: Omit<Task, "id"> & { id?: string }): Task {
  const newTask: Task = {
    id: task.id ?? crypto.randomUUID(),
    title: task.title,
    description: task.description ?? "",
    column: task.column,
  };
  tasks.push(newTask);
  return newTask;
}

export function updateTask(
  id: string,
  updates: Partial<Pick<Task, "title" | "description" | "column">>
): Task {
  const idx = tasks.findIndex((t) => t.id === id);
  if (idx === -1) throw new Error("Task not found");
  tasks[idx] = { ...tasks[idx], ...updates };
  return tasks[idx];
}

export function deleteTask(id: string): void {
  tasks = tasks.filter((t) => t.id !== id);
}
