import { Router } from "express";
import {
  createUserOrUpdateUserData,
  sendUserData,
} from "../controllers/user.controller.js";

const router = Router();

router.route("/create-user-or-update-exam").post(createUserOrUpdateUserData);

router.route("/import-user-data").post(sendUserData);

export default router;
