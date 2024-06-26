import { getWaitingList } from "@/action/action";
import { db } from "@/lib/db/db";
import { InsertData, schedule } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { handle } from "hono/vercel";

export const runtime = "edge";

const app = new Hono().basePath("/api");

app.use("/*", cors());
app.get("/schedule/waitinglist", async (c) => {
  try {
    const scheduleData = await getWaitingList();
    return c.json(scheduleData);
  } catch (e) {
    return c.json({ error: e });
  }
});

app.put("/schedule/waitinglist/:id", async (c) => {
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

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export default app as never;
