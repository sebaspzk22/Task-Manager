export type Status = "todo" | "in_progress" | "done";
export type Priority = "low" | "medium" | "high";
export type Sort = "createdAt" | "dueDate" | "priority";

export interface Task {
  id: number;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export type TaskInput = Pick<Task, "title" | "description" | "status" | "priority" | "dueDate">;

export interface Filters {
  status?: Status;
  priority?: Priority;
  q?: string;
  sort: Sort;
}

export const STATUS_LABELS: Record<Status, string> = {
  todo: "Por hacer",
  in_progress: "En progreso",
  done: "Hecha",
};

export const PRIORITY_LABELS: Record<Priority, string> = {
  low: "Baja",
  medium: "Media",
  high: "Alta",
};
