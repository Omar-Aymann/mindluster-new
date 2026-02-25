export type Task = {
  id: string;
  title: string;
  description: string;
  column: string;
};

export type ColumnDef = {
  id: string;
  title: string;
  color: string;
};

export const COLUMNS: ColumnDef[] = [
  { id: "backlog", title: "Backlog", color: "#9e9e9e" },
  { id: "in_progress", title: "In Progress", color: "#1976d2" },
  { id: "review", title: "Review", color: "#ed6c02" },
  { id: "done", title: "Done", color: "#2e7d32" },
];

export function getTasksByColumn(tasks: Task[]): Record<string, Task[]> {
  return tasks.reduce<Record<string, Task[]>>((acc, t) => {
    if (!acc[t.column]) acc[t.column] = [];
    acc[t.column].push(t);
    return acc;
  }, {});
}
