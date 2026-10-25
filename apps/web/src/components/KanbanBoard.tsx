import { useState } from "react";
import { STATUS_LABELS, type Status, type Task } from "../types";
import { DueDate, PriorityBadge } from "./badges";

interface Props {
  tasks: Task[];
  onMove: (id: number, status: Status) => void;
}

const COLUMNS = Object.keys(STATUS_LABELS) as Status[];

export function KanbanBoard({ tasks, onMove }: Props) {
  const [over, setOver] = useState<Status | null>(null);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {COLUMNS.map((status) => {
        const items = tasks.filter((t) => t.status === status);
        return (
          <section
            key={status}
            aria-label={STATUS_LABELS[status]}
            onDragOver={(e) => {
              e.preventDefault();
              setOver(status);
            }}
            onDragLeave={() => setOver(null)}
            onDrop={(e) => {
              e.preventDefault();
              setOver(null);
              const id = Number(e.dataTransfer.getData("text/plain"));
              const task = tasks.find((t) => t.id === id);
              if (task && task.status !== status) onMove(id, status);
            }}
            className={`min-h-48 rounded-lg p-3 transition-colors ${over === status ? "bg-indigo-100" : "bg-slate-100"}`}
          >
            <h2 className="mb-3 flex items-center justify-between text-sm font-semibold text-slate-600">
              {STATUS_LABELS[status]}
              <span className="rounded-full bg-white px-2 text-xs">{items.length}</span>
            </h2>
            <ul className="space-y-2">
              {items.map((t) => (
                <li
                  key={t.id}
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData("text/plain", String(t.id))}
                  className="cursor-grab rounded-md border border-slate-200 bg-white p-3 shadow-sm active:cursor-grabbing"
                >
                  <p className={`text-sm font-medium ${t.status === "done" ? "text-slate-400 line-through" : ""}`}>{t.title}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <PriorityBadge priority={t.priority} />
                    <DueDate date={t.dueDate} done={t.status === "done"} />
                  </div>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
