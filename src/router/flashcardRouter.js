import { Router } from "express";
import {
  postUserFlashcard,
  getFlashcardById,
  getFlashcardsByCollectionId,
  getFlashcardsToReviewByCollectionId,
  patchFlashcardById,
} from "../controllers/flashcardController.js";
import { validateBody, validateParams } from "../middleware/validation.js";
import { checkToken } from "../middleware/checkToken.js";
import {
  postFlashcardSchema,
  flashcardIdSchema,
  patchFlashcardSchema,
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
router.get(
  "/collection/:idCollection/to-review",
  validateParams(collectionIdSchema),
  getFlashcardsToReviewByCollectionId
);
router.patch(
  "/:idFlashcard",
  [validateParams(flashcardIdSchema), validateBody(patchFlashcardSchema)],
  patchFlashcardById
);

export default router;
