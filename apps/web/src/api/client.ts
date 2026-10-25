import type { Filters, Task, TaskInput } from "../types";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Request failed (${res.status})`);
  }
  return (res.status === 204 ? undefined : await res.json()) as T;
}

export const api = {
  list(filters: Filters) {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(filters)) if (v) params.set(k, v);
    return request<Task[]>(`/tasks?${params}`);
  },
  create: (input: TaskInput) => request<Task>("/tasks", { method: "POST", body: JSON.stringify(input) }),
  update: (id: number, input: Partial<TaskInput>) =>
    request<Task>(`/tasks/${id}`, { method: "PATCH", body: JSON.stringify(input) }),
  remove: (id: number) => request<void>(`/tasks/${id}`, { method: "DELETE" }),
};
