import { IsNotEmpty, IsNumber, MinLength } from 'class-validator';

export class RegisterBankingDto {
  @IsNumber()
  user_id: number;

  @IsNotEmpty()
  @MinLength(6)
  login_password: string;

  @IsNotEmpty()
  @MinLength(6)
  transaction_password: string;
}
