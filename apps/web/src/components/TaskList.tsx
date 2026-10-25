import type { Task, TaskInput } from "../types";
import { TaskItem } from "./TaskItem";

interface Props {
  tasks: Task[];
  onUpdate: (id: number, input: Partial<TaskInput>) => void;
  onDelete: (id: number) => void;
}

export function TaskList({ tasks, onUpdate, onDelete }: Props) {
  if (!tasks.length) return <p className="py-10 text-center text-sm text-slate-500">No hay tareas.</p>;
  return (
    <ul className="space-y-2">
      {tasks.map((t) => (
        <TaskItem key={t.id} task={t} onUpdate={(input) => onUpdate(t.id, input)} onDelete={() => onDelete(t.id)} />
      ))}
    </ul>
  );
}
