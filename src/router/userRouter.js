import { Router } from "express";
import {
  getUsers,
  getUserById,
  deleteUserById,
} from "../controllers/userController.js";
import { validateParams } from "../middleware/validation.js";
import { checkAdminToken } from "../middleware/checkToken.js";
import { userIdSchema } from "../models/user.js";

const router = Router();

router.use(checkAdminToken);

router.get("/", getUsers);
router.get("/:idUser", validateParams(userIdSchema), getUserById);
router.delete("/:idUser", validateParams(userIdSchema), deleteUserById);

export default router;
