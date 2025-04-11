import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateAccountDto {
  @IsNumber()
  userId: number;

  @IsEnum(['SAVINGS', 'CURRENT'])
  account_type: 'SAVINGS' | 'CURRENT';
}
