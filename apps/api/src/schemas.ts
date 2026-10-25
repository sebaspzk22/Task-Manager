import { z } from "zod";

export const STATUSES = ["todo", "in_progress", "done"] as const;
export const PRIORITIES = ["low", "medium", "high"] as const;
export const SORTS = ["createdAt", "dueDate", "priority"] as const;

const dueDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "dueDate must be YYYY-MM-DD")
  .nullable();

export const createTaskSchema = z.object({
  title: z.string().trim().min(1, "title is required").max(200),
  description: z.string().max(2000).default(""),
  status: z.enum(STATUSES).default("todo"),
  priority: z.enum(PRIORITIES).default("medium"),
  dueDate: dueDate.default(null),
});

export const updateTaskSchema = z
  .object({
    title: z.string().trim().min(1).max(200),
    description: z.string().max(2000),
    status: z.enum(STATUSES),
    priority: z.enum(PRIORITIES),
    dueDate,
  })
  .partial()
  .refine((v) => Object.keys(v).length > 0, "at least one field is required");

export const listQuerySchema = z.object({
  status: z.enum(STATUSES).optional(),
  priority: z.enum(PRIORITIES).optional(),
  q: z.string().trim().optional(),
  sort: z.enum(SORTS).default("createdAt"),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type ListQuery = z.infer<typeof listQuerySchema>;

export interface Task {
  id: number;
  title: string;
  description: string;
  status: (typeof STATUSES)[number];
  priority: (typeof PRIORITIES)[number];
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}
