import { Router } from "express";
import authRouter from "./features/auth/controller";
import eventRouter from "./features/event/controller";

const router = Router();

router.use("/auth", authRouter);
router.use("/event", eventRouter);

export default router;
