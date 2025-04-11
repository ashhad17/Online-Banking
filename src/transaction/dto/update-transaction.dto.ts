import { PartialType } from '@nestjs/mapped-types';
import { InitiateTransactionDto } from './initiate-transaction.dto';

export class UpdateTransactionDto extends PartialType(InitiateTransactionDto) {}
