import { PRIORITY_LABELS, STATUS_LABELS, type Filters, type Priority, type Sort, type Status } from "../types";

interface Props {
  value: Filters;
  onChange: (f: Filters) => void;
}

const control = "rounded-md border border-slate-300 bg-white px-3 py-2 text-sm";

export function TaskFilters({ value, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      <input
        aria-label="Buscar"
        placeholder="Buscar…"
        className={`${control} min-w-48 flex-1`}
        value={value.q ?? ""}
        onChange={(e) => onChange({ ...value, q: e.target.value || undefined })}
      />
      <select
        aria-label="Filtrar por estado"
        className={control}
        value={value.status ?? ""}
        onChange={(e) => onChange({ ...value, status: (e.target.value || undefined) as Status | undefined })}
      >
        <option value="">Todos los estados</option>
        {Object.entries(STATUS_LABELS).map(([v, l]) => (
          <option key={v} value={v}>{l}</option>
        ))}
      </select>
      <select
        aria-label="Filtrar por prioridad"
        className={control}
        value={value.priority ?? ""}
        onChange={(e) => onChange({ ...value, priority: (e.target.value || undefined) as Priority | undefined })}
      >
        <option value="">Todas las prioridades</option>
        {Object.entries(PRIORITY_LABELS).map(([v, l]) => (
          <option key={v} value={v}>{l}</option>
        ))}
      </select>
      <select
        aria-label="Ordenar"
        className={control}
        value={value.sort}
        onChange={(e) => onChange({ ...value, sort: e.target.value as Sort })}
      >
        <option value="createdAt">Más recientes</option>
        <option value="dueDate">Fecha límite</option>
        <option value="priority">Prioridad</option>
      </select>
    </div>
  );
}
