import { Router } from "express";
import {
  postUserFlashcard,
  getFlashcardById,
} from "../controllers/flashcardController.js";
import { validateBody, validateParams } from "../middleware/validation.js";
import { checkToken } from "../middleware/checkToken.js";
import {
  postFlashcardSchema,
  flashcardIdSchema,
} from "../models/flashcards.js";

const router = Router();

router.use(checkToken);

router.post("/", validateBody(postFlashcardSchema), postUserFlashcard);
router.get(
  "/:idFlashcard",
  validateParams(flashcardIdSchema),
  getFlashcardById
);

export default router;
