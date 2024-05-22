"use server"

import { db } from "@/lib/db/db";
import { InsertData, schedule } from "@/lib/db/schema";
import { cache } from "react";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";


export const getSchedule = cache(async () => {
  const schedule = await db.query.schedule.findMany();
  return schedule;
});


export const getHistory = cache(async () => {
  const history = await db.query.history.findMany();
  return history;
});


export const newData = async (data: InsertData) => {
  const newSchedule = await db.insert(schedule).values(data).returning();
  const getSchedule = await db.query.schedule.findFirst({
    where: eq(schedule.id, newSchedule[0]!.id),
  });
  revalidatePath("/");
  return getSchedule;
};

