import { PRIORITY_LABELS, type Priority } from "../types";

const PRIORITY_STYLES: Record<Priority, string> = {
  high: "bg-red-100 text-red-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-emerald-100 text-emerald-700",
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  return <span className={`rounded px-2 py-0.5 text-xs font-medium ${PRIORITY_STYLES[priority]}`}>{PRIORITY_LABELS[priority]}</span>;
}

export function DueDate({ date, done }: { date: string | null; done: boolean }) {
  if (!date) return null;
  const overdue = !done && date < new Date().toISOString().slice(0, 10);
  return <span className={`text-xs ${overdue ? "font-medium text-red-600" : "text-slate-500"}`}>Vence {date}</span>;
}
