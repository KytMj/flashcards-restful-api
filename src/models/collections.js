import { z } from "zod";

export const collectionIdSchema = z.object({
  idCollection: z.uuid(),
});

export const postCollectionSchema = z.object({
  title: z.string().min(1).max(64),
  description: z.string().max(255).optional(),
  visibility: z.enum(["PUBLIC", "PRIVATE"]),
});

export const patchCollectionSchema = z.object({
  title: z.string().max(64).optional(),
  description: z.string().max(255).optional(),
  visibility: z.enum(["PUBLIC", "PRIVATE"]).optional(),
});

export const searchCollectionSchema = z
  .object({
    title: z.string().max(64).optional(),
  })
  .optional();
