import { Router } from "express";
import {
  deleteCollection,
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
router.delete(
  "/:idCollection",
  validateParams(collectionIdSchema),
  deleteCollection
);

export default router;
