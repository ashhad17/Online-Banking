import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  aadhar: string;

  @IsNotEmpty()
  dob: Date;

  @IsNotEmpty()
  residential_address: string;

  @IsNotEmpty()
  permanent_address: string;

  @IsNotEmpty()
  occupation: string;
}
