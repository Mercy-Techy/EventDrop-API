import { Transform } from "class-transformer";
import {
  IsEmail,
  IsIn,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
} from "class-validator";

export class SignUpDto {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => (value as string).toLowerCase().trim())
  firstname!: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => (value as string).toLowerCase().trim())
  lastname!: string;

  @IsEmail()
  @Transform(({ value }) => (value as string).toLowerCase().trim())
  email!: string;

  @IsNotEmpty()
  @Transform(({ value }) => (value as string).trim())
  @IsStrongPassword(
    {},
    {
      message:
        "Password must be at least 8 characters long and must contain at least one capital letter, small letter, number and special character",
    }
  )
  password!: string;
}

export class ResetPasswordDto {
  @IsNotEmpty()
  token!: string;

  @IsStrongPassword(
    {},
    {
      message:
        "Password must be at least 8 characters long and must contain at least one capital letter, small letter, number and special character",
    }
  )
  password!: string;
}

export class LoginDto {
  @IsNotEmpty()
  email!: string;

  @IsNotEmpty()
  password!: string;
}
