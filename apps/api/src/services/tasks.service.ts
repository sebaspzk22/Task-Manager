import type { DB } from "../db.js";
import type { CreateTaskInput, ListQuery, Task, UpdateTaskInput } from "../schemas.js";

interface TaskRow {
  id: number;
  title: string;
  description: string;
  status: Task["status"];
  priority: Task["priority"];
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

const toTask = (r: TaskRow): Task => ({
  id: r.id,
  title: r.title,
  description: r.description,
  status: r.status,
  priority: r.priority,
  dueDate: r.due_date,
  createdAt: r.created_at,
  updatedAt: r.updated_at,
});

const ORDER_BY: Record<ListQuery["sort"], string> = {
  createdAt: "created_at DESC, id DESC",
  dueDate: "due_date IS NULL, due_date ASC, id DESC",
  priority: "CASE priority WHEN 'high' THEN 0 WHEN 'medium' THEN 1 ELSE 2 END, id DESC",
};

const COLUMNS: Record<keyof UpdateTaskInput, string> = {
  title: "title",
  description: "description",
  status: "status",
  priority: "priority",
  dueDate: "due_date",
};

export function createTasksService(db: DB) {
  const getById = (id: number): Task | undefined => {
    const row = db.prepare("SELECT * FROM tasks WHERE id = ?").get(id) as TaskRow | undefined;
    return row && toTask(row);
  };

  return {
    list(query: ListQuery): Task[] {
      const where: string[] = [];
      const params: Record<string, string> = {};
      if (query.status) {
        where.push("status = @status");
        params.status = query.status;
      }
      if (query.priority) {
        where.push("priority = @priority");
        params.priority = query.priority;
      }
      if (query.q) {
        where.push("(title LIKE @q OR description LIKE @q)");
        params.q = `%${query.q}%`;
      }
      const sql = `SELECT * FROM tasks ${where.length ? `WHERE ${where.join(" AND ")}` : ""} ORDER BY ${ORDER_BY[query.sort]}`;
      return (db.prepare(sql).all(params) as TaskRow[]).map(toTask);
    },

    get: getById,

    create(input: CreateTaskInput): Task {
      const { lastInsertRowid } = db
        .prepare(
          `INSERT INTO tasks (title, description, status, priority, due_date)
           VALUES (@title, @description, @status, @priority, @dueDate)`,
        )
        .run(input);
      return getById(Number(lastInsertRowid))!;
    },

    update(id: number, input: UpdateTaskInput): Task | undefined {
      const keys = Object.keys(input) as (keyof UpdateTaskInput)[];
      const sets = keys.map((k) => `${COLUMNS[k]} = @${k}`);
      sets.push("updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now')");
      const { changes } = db
        .prepare(`UPDATE tasks SET ${sets.join(", ")} WHERE id = @id`)
        .run({ ...input, id });
      return changes ? getById(id) : undefined;
    },

    remove(id: number): boolean {
      return db.prepare("DELETE FROM tasks WHERE id = ?").run(id).changes > 0;
    },
  };
}

export type TasksService = ReturnType<typeof createTasksService>;
