import express from "express";
import UserController from "../controllers/UserController";
import { jwtCheck, jwtParse } from "../middleware/auth";
import { validateMyUserRequest } from "../middleware/validation";

const router = express.Router();
router.get("/", jwtCheck, jwtParse, UserController.getCurrentUser);
router.post("/", jwtCheck, UserController.createCurrentUser);
router.put(
  "/",
  jwtCheck,
  jwtParse,
  validateMyUserRequest,
  UserController.updateCurrentUser
);

export default router;
