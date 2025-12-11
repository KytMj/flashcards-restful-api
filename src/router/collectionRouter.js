import { Router } from "express";
import {
  getCollection,
  getUserCollections,
} from "../controllers/collectionController.js";
import { validateBody, validateParams } from "../middleware/validation.js";
import { checkToken } from "../middleware/checkToken.js";
import { collectionIdSchema } from "../models/collections.js";

const router = Router();

router.use(checkToken);

router.get("/", getUserCollections);
router.get("/:id", validateParams(collectionIdSchema), getCollection);

export default router;
