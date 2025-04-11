import { IsNumber, IsNotEmpty } from 'class-validator';

export class LoginAuthDto {
  @IsNumber()
  user_id: number;

  @IsNotEmpty()
  password: string;
}
