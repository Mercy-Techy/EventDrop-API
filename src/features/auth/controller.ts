import { NextFunction, Request, Response, Router } from "express";
import validator from "../../utilities/validator";
import response from "../../utilities/response";
import { LoginDto, ResetPasswordDto, SignUpDto } from "./dto";
import { AuthService } from "./service";

const router = Router();

router.post(
  "/signup",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = await validator(SignUpDto, req.body, { whitelist: true });
      response(res, await AuthService.signup(body));
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/verify-email",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      response(res, await AuthService.verifyEmail(req.body.token));
    } catch (error) {
      next(error);
    }
  }
);
router.post(
  "/resend-verification-email",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      response(res, await AuthService.resendVerificationMail(req.body.email));
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/request-reset-password",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      response(res, await AuthService.requestResetPassword(req.body.email));
    } catch (error) {
      next(error);
    }
  }
);
router.post(
  "/reset-password",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = await validator(ResetPasswordDto, req.body);
      response(res, await AuthService.resetPassword(body));
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = await validator(LoginDto, req.body);
      response(res, await AuthService.login(body));
    } catch (error) {
      next(error);
    }
  }
);

export default router;
