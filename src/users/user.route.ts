import { Router } from "express";
import { userdelete, userLogin, userLogout, userRegistration } from "./user.controller";

const router = Router();

router.post("/register", userRegistration);
router.post("/login", userLogin);
router.post("/logout", userLogout);

// 🗑️ Delete user by ID
router.delete("/delete/:id", userdelete);

export default router;
  