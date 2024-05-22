import { getHistory, getSchedule } from "@/action/action";
import { db } from "@/lib/db/db";
import { InsertData, history, schedule } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { handle } from "hono/vercel";

export const runtime = "edge";

const app = new Hono().basePath("/api");

app.use("/*", cors());
app.get("/schedule", async (c) => {
  try {
    const scheduleData = await getSchedule();
    return c.json(scheduleData);
  } catch (e) {
    return c.json({ error: e });
  }
});

app.post("/schedule", async (c) => {
  try {
    const data = await c.req.json<InsertData>();
    if (!data) {
      return c.json({
        error: "missing required fields",
        status: 400
      });
    }
    const newSchedule = await db.insert(schedule).values(data).returning();
    const getSchedule = await db.query.schedule.findFirst({
      where: eq(schedule.id, newSchedule[0]!.id),
    });
    return c.json(getSchedule);
  } catch (e) {
    return c.json({ error: e });
  }
});

app.put("/schedule/:id", async (c) => {
  try {
    const scheduleId = parseInt(c.req.param("id"));
    const data = await c.req.json<InsertData>();

    if (!data) {
      return c.json({ error: "missing required fields" });
    }
    const getSchedule = await db.query.schedule.findFirst({
      where: eq(schedule.id, scheduleId),
    });
    if (!getSchedule) {
      return c.json({ error: "schedule not found" });
    }
    const update = await db
      .update(schedule)
      .set(data)
      .where(eq(schedule.id, scheduleId))
      .returning();

    return c.json(update);
  } catch (e) {
    return c.json({ error: e });
  }
});

app.delete("/schedule/:id", async (c) => {
  try {
    const scheduleId = parseInt(c.req.param("id"));
    const getSchedule = await db.query.schedule.findFirst({
      where: eq(schedule.id, scheduleId),
    });
    if (!getSchedule) {
      return c.json({ error: "schedule not found" });
    }
    const deleted = await db
      .delete(schedule)
      .where(eq(schedule.id, scheduleId))
      .returning();
    return c.json(deleted);
  } catch (e) {
    return c.json({ error: e });
  }
});

app.get("/history", async (c) => {
  try {
    const historyData = await getHistory();
    return c.json(historyData);
  } catch (e) {
    return c.json({ error: e });
  }
});

app.post("/history", async (c) => {
  try {
    const data = await c.req.json<InsertData>();

    if (!data) {
      return c.json({ error: "missing required fields" });
    }
    const newHistory = await db.insert(history).values(data).returning();
    const getHistory = await db.query.schedule.findFirst({
      where: eq(schedule.id, newHistory[0]!.id),
    });
    return c.json(getHistory);
  } catch (e) {
    return c.json({ error: e });
  }
});

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
export default app as never;
