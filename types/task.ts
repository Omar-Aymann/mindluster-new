export type TaskColumn = "backlog" | "in_progress" | "review" | "done";

export interface Task {
  id: string;
  title: string;
  description: string;
  column: TaskColumn;
  createdAt: string;
  order: number;
}

export const COLUMNS: TaskColumn[] = ["backlog", "in_progress", "review", "done"];

export const COLUMN_LABELS: Record<TaskColumn, string> = {
  backlog: "Backlog",
  in_progress: "In progress",
  review: "Review",
  done: "Done",
};
