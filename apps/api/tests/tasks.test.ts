import { beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import type { Express } from "express";
import { createApp } from "../src/app.js";
import { openDatabase } from "../src/db.js";

let app: Express;

beforeEach(() => {
  app = createApp(openDatabase(":memory:"));
});

const create = (body: object) => request(app).post("/api/tasks").send(body);

describe("tasks API", () => {
  it("creates a task with defaults", async () => {
    const res = await create({ title: "Write docs" });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      id: 1,
      title: "Write docs",
      description: "",
      status: "todo",
      priority: "medium",
      dueDate: null,
    });
  });

  it("rejects invalid input", async () => {
    expect((await create({ title: "  " })).status).toBe(400);
    expect((await create({ title: "x", priority: "urgent" })).status).toBe(400);
    expect((await create({ title: "x", dueDate: "tomorrow" })).status).toBe(400);
  });

  it("gets, updates and deletes a task", async () => {
    const { body } = await create({ title: "A" });
    expect((await request(app).get(`/api/tasks/${body.id}`)).body.title).toBe("A");

    const patched = await request(app).patch(`/api/tasks/${body.id}`).send({ status: "done" });
    expect(patched.status).toBe(200);
    expect(patched.body.status).toBe("done");
    expect(patched.body.title).toBe("A");

    expect((await request(app).delete(`/api/tasks/${body.id}`)).status).toBe(204);
    expect((await request(app).get(`/api/tasks/${body.id}`)).status).toBe(404);
  });

  it("returns 404/400 for missing or bad ids and empty patches", async () => {
    expect((await request(app).patch("/api/tasks/99").send({ title: "x" })).status).toBe(404);
    expect((await request(app).delete("/api/tasks/99")).status).toBe(404);
    expect((await request(app).get("/api/tasks/abc")).status).toBe(400);
    const { body } = await create({ title: "A" });
    expect((await request(app).patch(`/api/tasks/${body.id}`).send({})).status).toBe(400);
  });

  it("filters, searches and sorts", async () => {
    await create({ title: "Low later", priority: "low", dueDate: "2030-01-02" });
    await create({ title: "High soon", priority: "high", dueDate: "2030-01-01", status: "done" });
    await create({ title: "No date", description: "groceries", priority: "medium" });

    const byStatus = await request(app).get("/api/tasks?status=done");
    expect(byStatus.body.map((t: { title: string }) => t.title)).toEqual(["High soon"]);

    const search = await request(app).get("/api/tasks?q=grocer");
    expect(search.body).toHaveLength(1);

    const byPriority = await request(app).get("/api/tasks?sort=priority");
    expect(byPriority.body.map((t: { priority: string }) => t.priority)).toEqual(["high", "medium", "low"]);

    const byDue = await request(app).get("/api/tasks?sort=dueDate");
    expect(byDue.body.map((t: { title: string }) => t.title)).toEqual(["High soon", "Low later", "No date"]);

    expect((await request(app).get("/api/tasks?sort=bogus")).status).toBe(400);
  });
});
