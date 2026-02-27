"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
  type Task,
} from "@/lib/tasks-api";

export const tasksQueryKey = ["tasks"] as const;

export function useTasks() {
  return useQuery({
    queryKey: tasksQueryKey,
    queryFn: fetchTasks,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tasksQueryKey });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<Pick<Task, "title" | "description" | "column">>;
    }) => updateTask(id, updates),
    onMutate: async ({ id, updates }) => {
      await queryClient.cancelQueries({ queryKey: tasksQueryKey });
      const previousTasks = queryClient.getQueryData<Task[]>(tasksQueryKey);
      queryClient.setQueryData<Task[]>(tasksQueryKey, (old) => {
        if (!old) return old;
        return old.map((t) => (t.id === id ? { ...t, ...updates } : t));
      });
      return { previousTasks };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousTasks != null) {
        queryClient.setQueryData(tasksQueryKey, context.previousTasks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: tasksQueryKey });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTask,

    onMutate: async (id: string) => {
      queryClient.cancelQueries({queryKey: tasksQueryKey});
      const previousTasks = queryClient.getQueryData<Task[]>(tasksQueryKey);
      queryClient.setQueryData<Task[]>(tasksQueryKey, (old) => {
        if (!old) return old;
        return old.filter((t) => t.id !== id);
      });
      return { previousTasks };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousTasks != null) {
        queryClient.setQueryData(tasksQueryKey, context.previousTasks);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tasksQueryKey });
    },
  });
}
