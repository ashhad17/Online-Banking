import { IsNotEmpty, IsNumber, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @IsNumber()
  user_id: number;

  @IsNotEmpty()
  otp_code: string;

  @IsNotEmpty()
  @MinLength(6)
  new_password: string;
}
