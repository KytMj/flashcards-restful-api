import { Router } from "express";
import {
  postUserFlashcard,
  getFlashcardById,
  getFlashcardsByCollectionId,
} from "../controllers/flashcardController.js";
import { validateBody, validateParams } from "../middleware/validation.js";
import { checkToken } from "../middleware/checkToken.js";
import {
  postFlashcardSchema,
  flashcardIdSchema,
} from "../models/flashcards.js";
import { collectionIdSchema } from "../models/collections.js";

const router = Router();

router.use(checkToken);

router.post("/", validateBody(postFlashcardSchema), postUserFlashcard);
router.get(
  "/:idFlashcard",
  validateParams(flashcardIdSchema),
  getFlashcardById
);
router.get(
  "/collection/:idCollection",
  validateParams(collectionIdSchema),
  getFlashcardsByCollectionId
);

export default router;
