import { PartialType } from '@nestjs/mapped-types';
import { RegisterBankingDto } from './create-internet-banking.dto';

export class UpdateInternetBankingDto extends PartialType(RegisterBankingDto) {}
