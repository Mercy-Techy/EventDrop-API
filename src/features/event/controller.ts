import { NextFunction, Request, Response, Router } from "express";
import authenticator, { Req } from "../../middlewares/authenticator";
import { EventService } from "./service";
import validator from "../../utilities/validator";
import { AddEventDto } from "./dto";
import response from "../../utilities/response";
import { parser } from "../file/service";

const router = Router();

router.post(
  "/add",
  authenticator,
  parser.single("logo"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = await validator(AddEventDto, req.body);
      response(
        res,
        await EventService.addEvent((req as Req).user, body, req.file)
      );
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/fetch",
  authenticator,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      response(
        res,
        await EventService.fetchEvents(
          (req as Req).user.id,
          +(req.query.page || 1),
          +(req.query.limit || 10)
        )
      );
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/upload-image/:eventId",
  authenticator,
  parser.single("image"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      response(
        res,
        await EventService.uploadImage(
          (req as Req).user.id,
          String(req.params.eventId),
          req.file!
        )
      );
    } catch (error) {
      next(error);
    }
  }
);
router.post(
  "/upload-image-visitor/:generated_link",
  parser.single("image"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      response(
        res,
        await EventService.uploadImageByVisitors(
          String(req.params.generated_link),
          req.file!,
          req.ip!
        )
      );
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/fetch-images/:eventId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      response(
        res,
        await EventService.fetchEventImages(
          String(req.params.eventId),
          +(req.query.page || 1),
          +(req.query.limit || 10)
        )
      );
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/fetch-event/:generated_link",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      response(
        res,
        await EventService.fetchEventByLink(String(req.params.generated_link))
      );
    } catch (error) {
      next(error);
    }
  }
);

export default router;
