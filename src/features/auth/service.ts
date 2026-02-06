import { pool } from "../../config/database";
import { decodeJWT, signJWT, signRefreshJWT } from "../../utilities/jwt";
import mailer from "../../utilities/mailer";
import { ServiceResponse } from "../../utilities/response";
import TokenService from "../token/token.service";
import { UserService } from "../user/service";
import { LoginDto, ResetPasswordDto, SignUpDto } from "./dto";
import { compareSync, hashSync } from "bcryptjs";

export class AuthService {
  static async signup({
    firstname,
    lastname,
    email,
    password,
  }: SignUpDto): Promise<ServiceResponse> {
    try {
      const {
        data: user,
        status,
        message,
      } = await UserService.addUser(firstname, lastname, email, password);
      if (!status) throw new Error(message);
      const token = await TokenService.createToken(user.id, "verify-email", 6);
      await mailer({
        to: user.email,
        subject: "Verify Your Email",
        body: {
          heading: "Verify Your Email",
          name: user.firstname,
          content: `We received a request to verify your email. Kindly use the token below to verify your email:<br/><br/>${token}<br/><br/>If you did not request an email verification, please ignore this mail.<br/>This token is valid for the next 5 minutes. After this period, you will need to request for another token.`,
        },
      });
      return {
        status: true,
        message: "You have successfully signed up",
        data: "Registration successful, a token has been sent to your mail to verify your email",
      };
    } catch (error: any) {
      return { status: false, message: error.message, data: error };
    }
  }

  static async verifyEmail(token: string): Promise<ServiceResponse> {
    try {
      const tokenUser = await TokenService.verifyToken(token, "verify-email");
      const user = (
        await pool.query(
          `UPDATE users SET emailverified = $1 WHERE id = $2 RETURNING *`,
          [true, tokenUser]
        )
      ).rows[0];
      if (!user) throw new Error("Invalid token");
      return {
        status: true,
        message: "Email verified",
      };
    } catch (error: any) {
      return { status: false, message: error?.message, data: error };
    }
  }

  static async resendVerificationMail(email: string): Promise<ServiceResponse> {
    try {
      const user = (
        await pool.query(`SELECT * FROM users WHERE email = $1`, [email])
      ).rows[0];

      if (!user)
        throw new Error("You do not have an account with us kindly sign up");
      const token = await TokenService.createToken(user.id, "verify-email", 6);
      await mailer({
        to: user.email,
        subject: "Verify Your Email",
        body: {
          heading: "Verify Your Email",
          name: user.firstname,
          content: `We received a request to validate your account. Kindly use the token below to validate your account:<br/><br/>${token}<br/><br/>If you did not request an account validation, please ignore this email.<br/>This token is valid for the next 5 minutes. After this period, you will need to request for another token.`,
        },
      });
      return {
        status: true,
        message: "A token has been sent to your mail to verify your email",
      };
    } catch (error: any) {
      return { status: false, message: error?.message, data: error };
    }
  }

  static async requestResetPassword(email: string): Promise<ServiceResponse> {
    try {
      const user = (
        await pool.query(`SELECT * FROM users WHERE email = $1`, [email])
      ).rows[0];
      if (!user)
        throw new Error("You do not have an account with us kindly sign up");
      const token = await TokenService.createToken(user.id, "reset-password");
      await mailer({
        to: user.email,
        subject: "Reset Password",
        body: {
          heading: "Reset Password",
          name: user.firstname,
          content: `We received a request to reset your password. Kindly use the token below to reset your password:<br/><br/>${token}<br/><br/>If you did not request a password reset, please ignore this mail.<br/>This token is valid for the next 30 minutes. After this period, you will need to make a request for a new password reset.`,
        },
      });
      return {
        status: true,
        message: "A token has been sent to your mail to reset your password",
      };
    } catch (error: any) {
      return { status: false, message: error?.message, data: error };
    }
  }

  static async resetPassword({
    token,
    password,
  }: ResetPasswordDto): Promise<ServiceResponse> {
    try {
      const tokenUser = await TokenService.verifyToken(token, "reset-password");
      const hsPw = hashSync(password, 12);
      const user = (
        await pool.query(
          `UPDATE users SET password = $1 WHERE id = $2 RETURNING *`,
          [hsPw, tokenUser]
        )
      ).rows[0];
      if (!user)
        throw new Error("You do not have an account with us kindly sign up");
      return { status: true, message: "Password reset successful" };
    } catch (error: any) {
      return { status: false, message: error?.message, data: error };
    }
  }
  static async login({ email, password }: LoginDto): Promise<ServiceResponse> {
    try {
      const user = await (
        await pool.query(`SELECT * FROM users WHERE email = $1`, [email])
      ).rows[0];
      if (!user)
        throw new Error("You do not have an account with us kindly sign up");
      const validPassword = compareSync(password, user.password);
      if (!validPassword) throw new Error("Invalid Password");
      if (!user.emailverified) {
        this.resendVerificationMail(user.email);
        return {
          status: false,
          message:
            "Your email has not been verified, a token has been sent to your mail to verify your email",
          code: 402,
        };
      }
      const token = signJWT({
        email: user.email,
        id: user.id,
      });
      const refreshToken = signRefreshJWT({
        email: user.email,
        id: user.id,
      });

      const { password: ps, ...rest } = user;
      return {
        message: "Welcome to EventDrop",
        status: true,
        data: { user: rest, token, refreshToken },
      };
    } catch (error: any) {
      return { status: false, message: error?.message, data: error };
    }
  }
  static async refreshAccess(refreshToken: string): Promise<ServiceResponse> {
    try {
      const payload: { id: string; email: string } = decodeJWT(refreshToken);
      const user = (
        await pool.query(`SELECT * users WHERE id = $1`, [payload.id])
      ).rows[0];
      if (!user) throw new Error("You do not have an account with us");
      const token = signJWT({
        email: user.email,
        id: user.id,
      });

      return {
        message: "Successful",
        status: true,
        data: token,
      };
    } catch (error: any) {
      return { status: false, message: error?.message, data: error };
    }
  }
}
