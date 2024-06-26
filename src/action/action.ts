"use server"
import { db } from "@/lib/db/db";
import { InsertData, schedule } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { cache } from "react";

export const getWaitingList = async () => {
  const waitingList = await db.query.schedule.findMany({
    where: eq(schedule.status, "waiting"),
  });
  return waitingList;
};

export const getSchedule = cache(async () => {
  const schedule = await db.query.schedule.findMany();
  const sortedSchedule = schedule.sort((a, b) => {
    return new Date(a.datetime).getTime() - new Date(b.datetime).getTime();
  });
  return sortedSchedule;
});

export const getSchedulesByDate = cache(async (date: Date) => {
  const scheduleData = await db.query.schedule.findMany({
    where: eq(schedule.datetime, date.toISOString()),
  });
  return scheduleData;
});

export const newData = async (data: InsertData) => {
  const newSchedule = await db.insert(schedule).values(data).returning();
  const getSchedule = await db.query.schedule.findFirst({
    where: eq(schedule.id, newSchedule[0]!.id),
  });
  revalidatePath("/");
  return getSchedule;
};

export const updateData = async (data: InsertData) => {
  const updateSchedule = await db
    .update(schedule)
    .set(data)
    .where(eq(schedule.id, data.id ?? 0)) // Add null check and provide a default value
    .returning();
  const getSchedule = await db.query.schedule.findFirst({
    where: eq(schedule.id, updateSchedule[0]!.id), // Add null check and provide a default value
  });
  revalidatePath("/");
  return getSchedule;
};

export const deleteData = async (id: number) => {
  const deleteSchedule = await db
    .delete(schedule)
    .where(eq(schedule.id, id))
    .returning();
  revalidatePath("/");
  return deleteSchedule;
}

