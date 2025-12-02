import { NextFunction, Request, Response, Router } from "express";
import { Req } from "../../middlewares/authenticator";
import { UserService } from "./service";
import validator from "../../utilities/validator";
import { AddUserDto } from "./dto";
import response from "../../utilities/response";
import { parser } from "../file/service";

const router = Router();

router.get(
  "/fetch-user",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { password, ...data } = (req as Req).user;
      response(res, { status: true, message: "User Details", data });
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/upload-profile-picture",
  parser.single("avatar"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      response(
        res,
        await UserService.uploadProfilePicture(req.file!, (req as Req).user)
      );
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  "/update-profile",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = await validator(AddUserDto, req.body, { whitelist: true });
      response(
        res,
        await UserService.updateProfile((req as Req).user.id, body)
      );
    } catch (error) {
      next(error);
    }
  }
);

export default router;
