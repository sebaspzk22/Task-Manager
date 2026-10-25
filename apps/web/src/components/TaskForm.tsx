import { useState, type FormEvent } from "react";
import { PRIORITY_LABELS, STATUS_LABELS, type Priority, type Status, type Task, type TaskInput } from "../types";

interface Props {
  initial?: Task;
  onSubmit: (input: TaskInput) => void;
  onCancel?: () => void;
  submitLabel?: string;
}

const input = "w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none";

export function TaskForm({ initial, onSubmit, onCancel, submitLabel = "Añadir tarea" }: Props) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [status, setStatus] = useState<Status>(initial?.status ?? "todo");
  const [priority, setPriority] = useState<Priority>(initial?.priority ?? "medium");
  const [dueDate, setDueDate] = useState(initial?.dueDate ?? "");
  const [error, setError] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("El título es obligatorio");
      return;
    }
    onSubmit({ title: title.trim(), description, status, priority, dueDate: dueDate || null });
    if (!initial) {
      setTitle("");
      setDescription("");
      setStatus("todo");
      setPriority("medium");
      setDueDate("");
    }
    setError("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <input
          aria-label="Título"
          placeholder="¿Qué hay que hacer?"
          className={input}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>
      <textarea
        aria-label="Descripción"
        placeholder="Descripción (opcional)"
        rows={2}
        className={input}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <select aria-label="Estado" className={input} value={status} onChange={(e) => setStatus(e.target.value as Status)}>
          {Object.entries(STATUS_LABELS).map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
        <select aria-label="Prioridad" className={input} value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
          {Object.entries(PRIORITY_LABELS).map(([v, l]) => (
            <option key={v} value={v}>Prioridad {l.toLowerCase()}</option>
          ))}
        </select>
        <input aria-label="Fecha límite" type="date" className={input} value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
      </div>
      <div className="flex justify-end gap-2">
        {onCancel && (
          <button type="button" onClick={onCancel} className="rounded-md px-4 py-2 text-sm text-slate-600 hover:bg-slate-100">
            Cancelar
          </button>
        )}
        <button type="submit" className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
