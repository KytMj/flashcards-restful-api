import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { SQL, sql } from "drizzle-orm";
import { randomUUID } from "crypto";

export const usersTable = sqliteTable("users", {
  idUser: text("id_user")
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  email: text().notNull().unique(),
  firstname: text({ length: 30 }).notNull(),
  lastname: text({ length: 30 }).notNull(),
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
  idCollection: text("id_collection")
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  title: text({ length: 64 }).notNull(),
  description: text({ length: 255 }),
  visibility: text({ enum: ["PRIVATE", "PUBLIC"] })
    .notNull()
    .default("PRIVATE"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  idUser: text("id_user")
    .references(() => usersTable.idUser, { onDelete: "cascade" })
    .notNull(),
});

export const flashcardsTable = sqliteTable("flashcards", {
  idFlashcard: text("id_flashcard")
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  rectoText: text("recto_text", { length: 255 }).notNull(),
  versoText: text("verso_text", { length: 255 }).notNull(),
  idCollection: text("id_collection")
    .references(() => collectionsTable.idCollection, { onDelete: "cascade" })
    .notNull(),
});

export const reviewsTable = sqliteTable("reviews", {
  idReview: text("id_review")
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  currentLevel: integer("current_level", {
    enum: [1, 2, 3, 4, 5],
  })
    .notNull()
    .default(1),
  lastReview: integer("last_review", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  nextReview: integer("next_review", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => {
      date = new Date();
      date.setDate(date.getDate() + 1);
      return date;
    }),
  idUser: text("id_user")
    .references(() => usersTable.idUser, { onDelete: "cascade" })
    .notNull(),
  idFlashcard: text("id_flashcard")
    .references(() => flashcardsTable.idFlashcard, { onDelete: "cascade" })
    .notNull(),
});

export const urlsTable = sqliteTable("urls", {
  idUrl: text("id_url")
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  side: text({
    enum: ["RECTO", "VERSO"],
  })
    .notNull()
    .default("RECTO"),
  url: text({ length: 2083 }).notNull(),
  idFlashcard: text("id_flashcard")
    .references(() => flashcardsTable.idFlashcard, { onDelete: "cascade" })
    .notNull(),
});

/**
 *
 * @param {string} text
 * @returns SQL
 */
export function lower(text) {
  return sql`lower(${text})`;
}
