import { Response, NextFunction, Request } from "express";
import { decodeJWT } from "../utilities/jwt";
import { pool } from "../config/database";
import { IUser } from "../features/user/dto";

export interface Req extends Request {
  user: IUser;
}

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) throw new Error("Unauthorized");
    let payload: { email: string; id: string };
    payload = decodeJWT(token);
    let user = await (
      await pool.query(`SELECT * FROM users WHERE id = $1`, [payload.id])
    ).rows[0];
    if (!user) throw new Error("Invalid Token");
    (req as Req).user = user;
    next();
  } catch (error) {
    next(error);
  }
};
