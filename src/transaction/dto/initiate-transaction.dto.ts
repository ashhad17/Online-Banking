import { IsNotEmpty, IsNumber, IsEnum } from 'class-validator';

export class InitiateTransactionDto {
  @IsNotEmpty()
  sender_account: string;

  @IsNotEmpty()
  receiver_account: string;

  @IsNumber()
  amount: number;

  @IsEnum(['IMPS', 'NEFT', 'RTGS'])
  mode: 'IMPS' | 'NEFT' | 'RTGS';
}
