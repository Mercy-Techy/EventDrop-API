import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class AddEventDto {
  @IsNotEmpty()
  @IsString()
  title!: string;

  @IsNotEmpty()
  @IsString()
  description!: string;

  @IsNotEmpty()
  @IsString()
  event_location!: string;

  @IsNotEmpty()
  @IsString()
  event_date!: string;

  @IsNotEmpty()
  @IsString()
  event_time!: string;

  @IsOptional()
  @IsInt()
  link_expires_at?: number;
}

export class EditEventDto extends AddEventDto {
  @IsNotEmpty()
  @IsString()
  id!: string;
}
