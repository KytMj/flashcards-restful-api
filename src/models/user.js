import { z } from "zod";

export const registerSchema = z.object({
  email: z.email().min(1),
  firstname: z.string().min(2).max(50),
  lastname: z.string().min(2).max(50),
  password: z.string().min(8).max(255),
});

export const loginSchema = z.object({
  email: z.email().min(1),
  password: z.string().min(8).max(255),
});

export const userIdSchema = z.object({
  id: z.uuid(),
});
