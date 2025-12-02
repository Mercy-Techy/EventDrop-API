import { Router } from "express";
import authRouter from "./features/auth/controller";
import eventRouter from "./features/event/controller";
import userRouter from "./features/user/controller";
import authenticator from "./middlewares/authenticator";

const router = Router();

router.use("/auth", authRouter);
router.use("/event", eventRouter);
router.use("/user", authenticator, userRouter);

export default router;
