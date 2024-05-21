import { db } from "@/lib/db/db";
import { InsertData, schedule } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { handle } from "hono/vercel";
import { PageConfig } from "next";

const newData = async (data: InsertData) => {
  const newSchedule = await db.insert(schedule).values(data).returning();
  const getSchedule = await db.query.schedule.findFirst({
    where: eq(schedule.id, newSchedule[0]!.id),
  });
  return getSchedule;
};

export const runtime = "edge";

const app = new Hono().basePath("/api");

app.use("/*", cors());
app.get("/schedule", async (c) => {
  try {
    const schedule = await db.query.schedule.findMany();
    return c.json(schedule);
  } catch (e) {
    return c.json({ error: e });
  }
});

app.post("/schedule", async (c) => {
  try {
    const data = await c.req.json<InsertData>();

    if (!data) {
      return c.json({ error: "missing required fields" });
    }
    const schedule = await newData(data);
    return c.json(schedule);
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

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
export default app as never;
