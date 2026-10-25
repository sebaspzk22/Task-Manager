import express from "express";
import cors from "cors";
import type { DB } from "./db.js";
import { createTasksService } from "./services/tasks.service.js";
import { tasksRouter } from "./routes/tasks.routes.js";
import { errorHandler, notFound } from "./middleware/error.js";

export function createApp(db: DB) {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true });
  });
  app.use("/api/tasks", tasksRouter(createTasksService(db)));

  app.use(notFound);
  app.use(errorHandler);
  return app;
}
