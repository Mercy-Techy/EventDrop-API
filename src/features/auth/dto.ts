import { Transform } from "class-transformer";
import { IsNotEmpty, IsStrongPassword } from "class-validator";
import { AddUserDto } from "../user/dto";

export class SignUpDto extends AddUserDto {
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
