import { date, integer, pgTable, serial, } from "drizzle-orm/pg-core";

export const schedule = pgTable("schedule", {
  id: serial("id").primaryKey(),
  datetime: date("datetime").notNull(),
  weight: integer("weight").notNull(),
})

export const history = pgTable("history", {
  id: serial("id").primaryKey(),
  datetime: date("datetime").notNull(),
  weight: integer("weight").notNull(),
})

export type Data = typeof schedule.$inferSelect;
export type InsertData = typeof schedule.$inferInsert;
