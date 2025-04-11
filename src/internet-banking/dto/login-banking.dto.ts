import { IsNumber, IsNotEmpty } from 'class-validator';

export class LoginBankingDto {
  @IsNumber()
  user_id: number;

  @IsNotEmpty()
  password: string;
}
