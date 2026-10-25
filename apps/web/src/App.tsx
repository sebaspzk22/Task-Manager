import { useDeferredValue, useState } from "react";
import { useTaskMutations, useTasks } from "./hooks/useTasks";
import type { Filters } from "./types";
import { TaskForm } from "./components/TaskForm";
import { TaskFilters } from "./components/TaskFilters";
import { TaskList } from "./components/TaskList";
import { KanbanBoard } from "./components/KanbanBoard";

type View = "list" | "kanban";

export default function App() {
  const [filters, setFilters] = useState<Filters>({ sort: "createdAt" });
  const [view, setView] = useState<View>("list");
  const deferredFilters = useDeferredValue(filters);
  const { data: tasks = [], isLoading, error } = useTasks(deferredFilters);
  const { create, update, remove } = useTaskMutations();
  const mutationError = create.error ?? update.error ?? remove.error;

  const tab = (v: View, label: string) => (
    <button
      onClick={() => setView(v)}
      className={`rounded-md px-3 py-1.5 text-sm ${view === v ? "bg-white font-medium shadow-sm" : "text-slate-600"}`}
    >
      {label}
    </button>
  );

  return (
    <main className="mx-auto max-w-5xl space-y-6 p-4 sm:p-8">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Task Manager</h1>
        <div className="flex gap-1 rounded-lg bg-slate-200 p-1">
          {tab("list", "Lista")}
          {tab("kanban", "Kanban")}
        </div>
      </header>

      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <TaskForm onSubmit={(input) => create.mutate(input)} />
      </section>

      <TaskFilters value={filters} onChange={setFilters} />

      {(error || mutationError) && (
        <p role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-700">
          {(error ?? mutationError)?.message}
        </p>
      )}

      {isLoading ? (
        <p className="py-10 text-center text-sm text-slate-500">Cargando…</p>
      ) : view === "list" ? (
        <TaskList
          tasks={tasks}
          onUpdate={(id, input) => update.mutate({ id, input })}
          onDelete={(id) => remove.mutate(id)}
        />
      ) : (
        <KanbanBoard tasks={tasks} onMove={(id, status) => update.mutate({ id, input: { status } })} />
      )}
    </main>
  );
}
