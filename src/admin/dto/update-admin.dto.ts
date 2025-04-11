import { PartialType } from '@nestjs/mapped-types';
import { AdminLoginDto } from './create-admin.dto';

export class UpdateAdminDto extends PartialType(AdminLoginDto) {}
