import { ServiceResponse } from "../../utilities/response";
import { TokenModel } from "./token.schema";
import { pool } from "../../config/database";
import random from "randomstring";

export default class TokenService {
  static generator(length: number) {
    const chars = "0123456789";
    let code = "";
    for (let i = 0; i < length; i += 1) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  static async generateToken(length: number): Promise<ServiceResponse> {
    try {
      let availableCode: any = false;
      do {
        const token = this.generator(length);
        const code = (
          await pool.query(`SELECT * FROM tokens WHERE token = $1`, [token])
        ).rows[0];
        if (!code) availableCode = token;
      } while (!availableCode);
      return { status: true, message: "Token generated", data: availableCode };
    } catch (error: any) {
      return { status: false, message: error.message };
    }
  }

  static async createToken(
    user: string,
    type: string,
    length?: number
  ): Promise<string> {
    const token = await this.generateToken(length || 6);
    if (!token.status) throw new Error(token.message);
    await pool.query(`DELETE FROM tokens WHERE user_id = $1`, [user]);
    await pool.query(
      `INSERT INTO tokens (user_id,type,token,expiresAt) VALUES ($1, $2, $3, NOW() + interval '5 minutes')`,
      [user, type, token.data]
    );
    return token.data;
  }

  static async verifyToken(token: string, type: string): Promise<string> {
    const tokenData = (
      await pool.query(`SELECT * FROM tokens WHERE token = $1 AND type = $2`, [
        token,
        type,
      ])
    ).rows[0];
    const now = new Date();
    if (!tokenData || new Date(tokenData.expiresAt) < now) {
      if (tokenData) {
        await pool.query(
          `DELETE FROM tokens WHERE user_id = $1 AND type = $2`,
          [tokenData.user_id, type]
        );
        throw new Error("Token expired");
      }
      throw new Error("Invalid token");
    }

    await pool.query(`DELETE FROM tokens WHERE user_id = $1 AND type = $2`, [
      tokenData.user_id,
      type,
    ]);
    return tokenData.user_id;
  }

  static async generateLinkToken() {
    let token = null;
    while (!token) {
      const characters = random.generate(20);
      const event = (
        await pool.query(`SELECT * FROM events WHERE generated_link = $1`, [
          characters,
        ])
      ).rows[0];
      if (!event) token = characters;
    }
    return token;
  }
}
