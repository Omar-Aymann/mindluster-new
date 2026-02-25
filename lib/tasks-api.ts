// Use json-server in dev when set; otherwise use Next.js API routes (works on Vercel)
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
const TASKS_BASE = API_URL ? `${API_URL}/tasks` : "/api/tasks";

export type Task = {
  id: string;
  title: string;
  description: string;
  column: string;
};

function normalizeTask(raw: { id: string | number; title: string; description: string; column: string }): Task {
  return {
    id: String(raw.id),
    title: raw.title,
    description: raw.description ?? "",
    column: raw.column,
  };
}

export async function fetchTasks(): Promise<Task[]> {
  const res = await fetch(TASKS_BASE);
  if (!res.ok) throw new Error("Failed to fetch tasks");
  const data = await res.json();
  return Array.isArray(data) ? data.map(normalizeTask) : [];
}

export async function createTask(task: Omit<Task, "id"> & { id?: string }): Promise<Task> {
  const body = {
    id: task.id ?? crypto.randomUUID(),
    title: task.title,
    description: task.description,
    column: task.column,
  };
  const res = await fetch(TASKS_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Failed to create task");
  return normalizeTask(await res.json());
}

export async function updateTask(id: string, updates: Partial<Pick<Task, "title" | "description" | "column">>): Promise<Task> {
  const res = await fetch(`${TASKS_BASE}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Failed to update task");
  return normalizeTask(await res.json());
}

export async function deleteTask(id: string): Promise<void> {
  const res = await fetch(`${TASKS_BASE}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete task");
}
