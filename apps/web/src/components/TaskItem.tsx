import { useState } from "react";
import { STATUS_LABELS, type Task, type TaskInput } from "../types";
import { TaskForm } from "./TaskForm";
import { DueDate, PriorityBadge } from "./badges";

interface Props {
  task: Task;
  onUpdate: (input: Partial<TaskInput>) => void;
  onDelete: () => void;
}

export function TaskItem({ task, onUpdate, onDelete }: Props) {
  const [editing, setEditing] = useState(false);
  const done = task.status === "done";

  if (editing) {
    return (
      <li className="rounded-lg border border-indigo-200 bg-white p-4">
        <TaskForm
          initial={task}
          submitLabel="Guardar"
          onCancel={() => setEditing(false)}
          onSubmit={(input) => {
            onUpdate(input);
            setEditing(false);
          }}
        />
      </li>
    );
  }

  return (
    <li className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-4">
      <input
        type="checkbox"
        aria-label={`Completar ${task.title}`}
        className="mt-1 h-4 w-4 accent-indigo-600"
        checked={done}
        onChange={() => onUpdate({ status: done ? "todo" : "done" })}
      />
      <div className="min-w-0 flex-1">
        <p className={`font-medium ${done ? "text-slate-400 line-through" : ""}`}>{task.title}</p>
        {task.description && <p className="mt-0.5 text-sm text-slate-500">{task.description}</p>}
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <PriorityBadge priority={task.priority} />
          <span className="text-xs text-slate-500">{STATUS_LABELS[task.status]}</span>
          <DueDate date={task.dueDate} done={done} />
        </div>
      </div>
      <div className="flex gap-1">
        <button onClick={() => setEditing(true)} className="rounded px-2 py-1 text-sm text-slate-600 hover:bg-slate-100">
          Editar
        </button>
        <button onClick={onDelete} className="rounded px-2 py-1 text-sm text-red-600 hover:bg-red-50">
          Eliminar
        </button>
      </div>
    </li>
  );
}
