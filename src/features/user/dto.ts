import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export interface IUser {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  plan: string;
  created_at: Date;
  updated_at: Date;
  avatar_public_id?: string;
  avatar_url?: string;
}

export class AddUserDto {
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
}
