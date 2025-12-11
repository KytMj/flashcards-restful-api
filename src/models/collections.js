import { z } from "zod";

export const collectionIdSchema = z.object({
  idCollection: z.uuid(),
});
