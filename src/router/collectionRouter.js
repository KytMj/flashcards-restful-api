import { Router } from "express";
import {
  getCollection,
  getUserCollections,
  postUserCollection,
  searchPublicCollections,
} from "../controllers/collectionController.js";
import { validateBody, validateParams } from "../middleware/validation.js";
import { checkToken } from "../middleware/checkToken.js";
import {
  collectionIdSchema,
  postCollectionSchema,
  searchCollectionSchema,
} from "../models/collections.js";

const router = Router();

router.use(checkToken);

router.get("/", getUserCollections);
router.post("/", validateBody(postCollectionSchema), postUserCollection);
router.get("/:idCollection", validateParams(collectionIdSchema), getCollection);
router.post(
  "/search",
  validateBody(searchCollectionSchema),
  searchPublicCollections
);

export default router;
