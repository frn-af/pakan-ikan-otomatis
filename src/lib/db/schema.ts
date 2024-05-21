import { integer, pgTable, serial, text } from "drizzle-orm/pg-core";

export const schedule = pgTable("schedule", {
  id: serial("id").primaryKey(),
  datetime: text("datetime").notNull(),
  weight: integer("weight").notNull(),
})

export const history = pgTable("history", {
  id: serial("id").primaryKey(),
  datetime: text("datetime").notNull(),
  weight: integer("weight").notNull(),
})

export type Data = typeof schedule.$inferSelect;
export type InsertData = typeof schedule.$inferInsert;
