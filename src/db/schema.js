import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { randomUUID } from "crypto";

export const usersTable = sqliteTable("users", {
  id: text()
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  email: text().notNull().unique(),
  firstname: text({ length: 30 }).notNull().unique(),
  lastname: text({ length: 30 }).notNull().unique(),
  password: text({ length: 255 }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  role: text({ enum: ["USER", "ADMIN"] })
    .notNull()
    .default("USER"),
});

export const collectionsTable = sqliteTable("collections", {
  id: text()
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  email: text().notNull().unique(),
  firstname: text({ length: 30 }).notNull().unique(),
  lastname: text({ length: 30 }).notNull().unique(),
  password: text({ length: 255 }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  role: text({ enum: ["USER", "ADMIN"] })
    .notNull()
    .default("USER"),
});