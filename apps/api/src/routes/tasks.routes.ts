import { Router } from "express";
import { createTaskSchema, listQuerySchema, updateTaskSchema } from "../schemas.js";
import type { TasksService } from "../services/tasks.service.js";
import { HttpError } from "../middleware/error.js";

const parseId = (raw: string): number => {
  const id = Number(raw);
  if (!Number.isInteger(id) || id <= 0) throw new HttpError(400, "Invalid task id");
  return id;
};

export function tasksRouter(service: TasksService): Router {
  const router = Router();

  router.get("/", (req, res) => {
    res.json(service.list(listQuerySchema.parse(req.query)));
  });

  router.post("/", (req, res) => {
    res.status(201).json(service.create(createTaskSchema.parse(req.body)));
  });

  router.get("/:id", (req, res) => {
    const task = service.get(parseId(req.params.id));
    if (!task) throw new HttpError(404, "Task not found");
    res.json(task);
  });

  router.patch("/:id", (req, res) => {
    const id = parseId(req.params.id);
    const task = service.update(id, updateTaskSchema.parse(req.body));
    if (!task) throw new HttpError(404, "Task not found");
    res.json(task);
  });

  router.delete("/:id", (req, res) => {
    if (!service.remove(parseId(req.params.id))) throw new HttpError(404, "Task not found");
    res.status(204).end();
  });

  return router;
}
