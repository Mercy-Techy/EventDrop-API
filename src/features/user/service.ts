import { hashSync } from "bcryptjs";
import { pool } from "../../config/database";
import { ServiceResponse } from "../../utilities/response";
import { IUser } from "./dto";
import { file, FileService } from "../file/service";

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
      const user = (
        await pool.query<IUser>(
          `INSERT INTO users (firstname,lastname,email,password) VALUES ($1, $2, $3, $4) RETURNING *`,
          [firstname, lastname, email, hashedPw]
        )
      ).rows[0];
      return { status: true, message: "User Added", data: user };
    } catch (error: any) {
      return { status: false, message: error.message, data: error };
    }
  }

  static async uploadProfilePicture(
    file: file,
    user: IUser
  ): Promise<ServiceResponse> {
    try {
      if (user.avatar_public_id) {
        await FileService.deleteFile(user.avatar_public_id);
      }
      const uploadedAvatar = await FileService.uploadFile(
        file.buffer,
        "avatar"
      );
      if (!uploadedAvatar) throw new Error("Error uploading file");
      const updatedUser = (
        await pool.query(
          `UPDATE users SET avatar_url = $1, avatar_public_id = $2 WHERE id = $3 RETURNING *`,
          [uploadedAvatar.url, uploadedAvatar.public_id, user.id]
        )
      ).rows[0];
      if (!updatedUser) throw new Error("User does not exist");
      return { status: true, message: "Profile picture uploaded" };
    } catch (error: any) {
      return { status: false, message: error.message, data: error };
    }
  }

  static async updateProfile(
    user: string,
    {
      firstname,
      lastname,
      email,
    }: { firstname: string; lastname: string; email: string }
  ): Promise<ServiceResponse> {
    try {
      const existingUser = (
        await pool.query(`SELECT * FROM users WHERE email = $1 AND id != $2`, [
          email,
          user,
        ])
      ).rows[0];
      if (existingUser) throw new Error("User with this email already exist");
      const updatedUser = (
        await pool.query<IUser>(
          `UPDATE users SET firstname = $1, lastname = $2, email = $3 WHERE id = $4 RETURNING *`,
          [firstname, lastname, email, user]
        )
      ).rows[0];
      if (!updatedUser) throw new Error("User does not exist");
      const { password, ...data } = updatedUser;
      return { status: true, message: "User Added", data };
    } catch (error: any) {
      return { status: false, message: error.message, data: error };
    }
  }
}
