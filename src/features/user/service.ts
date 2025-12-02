import { hashSync } from "bcryptjs";
import { pool } from "../../config/database";
import { ServiceResponse } from "../../utilities/response";
import { IUser } from "./dto";

export class UserService {
  static async addUser(
    firstname: string,
    lastname: string,
    email: string,
    password: string
  ): Promise<ServiceResponse> {
    try {
      const existingUser = (
        await pool.query(`SELECT * FROM users WHERE email = $1`, [email])
      ).rows[0];
      if (existingUser) throw new Error("User with this email already exist");
      const hashedPw = hashSync(password, 12);
      const user = await pool.query<IUser>(
        `INSERT INTO users (firstname,lastname,email,password) VALUES ($1, $2, $3, $4) RETURNING *`,
        [firstname, lastname, email, hashedPw]
      );
      return { status: true, message: "User Added", data: user.rows[0] };
    } catch (error: any) {
      return { status: false, message: error.message, data: error };
    }
  }
}
