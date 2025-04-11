import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreatePayeeDto {
  @IsNumber()
  user_id: number;

  @IsNotEmpty()
  beneficiary_name: string;

  @IsNotEmpty()
  beneficiary_account_number: string;

  @IsOptional()
  nickname?: string;
}
