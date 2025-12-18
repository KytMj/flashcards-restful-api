import { Router } from "express";
import {
  deleteCollection,
  getCollectionById,
  getUserCollections,
  postUserCollection,
  searchPublicCollections,
  patchCollection,
} from "../controllers/collectionController.js";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../middleware/validation.js";
import { checkToken } from "../middleware/checkToken.js";
import {
  collectionIdSchema,
  postCollectionSchema,
  searchCollectionSchema,
  patchCollectionSchema,
} from "../models/collections.js";

const router = Router();

router.use(checkToken);

router.get(
  "/search",
  validateQuery(searchCollectionSchema),
  searchPublicCollections
);

router.get("/", getUserCollections);

router.get(
  "/:idCollection",
  validateParams(collectionIdSchema),
  getCollectionById
);

router.post("/", validateBody(postCollectionSchema), postUserCollection);
router.patch(
  "/:idCollection",
  [validateParams(collectionIdSchema), validateBody(patchCollectionSchema)],
  patchCollection
);
router.delete(
  "/:idCollection",
  validateParams(collectionIdSchema),
  deleteCollection
);

export default router;
