import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/client";
import type { Filters, TaskInput } from "../types";

const KEY = ["tasks"];

export function useTasks(filters: Filters) {
  return useQuery({ queryKey: [...KEY, filters], queryFn: () => api.list(filters) });
}

export function useTaskMutations() {
  const qc = useQueryClient();
  const onSuccess = () => qc.invalidateQueries({ queryKey: KEY });
  return {
    create: useMutation({ mutationFn: (input: TaskInput) => api.create(input), onSuccess }),
    update: useMutation({
      mutationFn: ({ id, input }: { id: number; input: Partial<TaskInput> }) => api.update(id, input),
      onSuccess,
    }),
    remove: useMutation({ mutationFn: (id: number) => api.remove(id), onSuccess }),
  };
}
