import { z } from "zod";

export const flashcardIdSchema = z.object({
  idFlashcard: z.uuid(),
});

export const postFlashcardSchema = z.object({
  rectoText: z.string().min(1).max(255),
  versoText: z.string().min(1).max(255),
  urls: z
    .array(
      z
        .object({
          side: z.enum(["RECTO", "VERSO"]),
          url: z.string().min(1).max(2083),
        })
        .optional()
    )
    .optional(),
  idCollection: z.uuid(),
});
