import { Router } from "express";
import { postUserFlashcard } from "../controllers/flashcardController.js";
import { validateBody, validateParams } from "../middleware/validation.js";
import { checkToken } from "../middleware/checkToken.js";
import { postFlashcardSchema } from "../models/flashcards.js";

const router = Router();

router.use(checkToken);

router.post("/", validateBody(postFlashcardSchema), postUserFlashcard);

export default router;
