import { Router } from "express";
import { getSalaries, createSalaries } from '../controllers/salariesController.js';

const router = Router();

router.get("/", getSalaries);
router.post("/", createSalaries);

export default router;