import { Router } from "express";
import { createSheet, deleteSheet, getSheet, updateSheet } from "./document.controller";
import { verifyToken } from "../middleware/verifyToken";

const router = Router();
  
router.post("/", verifyToken, createSheet);
router.get("/", verifyToken, getSheet);
router.put("/:id", verifyToken, updateSheet);
router.delete("/:id", verifyToken, deleteSheet);


export default router;
