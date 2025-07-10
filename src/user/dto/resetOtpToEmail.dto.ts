import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
} from 'class-validator';

export class ResetPasswordEmailDto {
  @ApiProperty({ example: 'liviarosser@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
