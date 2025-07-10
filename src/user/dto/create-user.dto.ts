import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Animakid' })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ example: 'StrongPass123' })
  @IsString() 
  @MaxLength(16)
  @MinLength(4)
  password: string;

  @ApiProperty({ example: 'liviarosser@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: UserRole.ARTIST,
    enum: [UserRole.ARTIST],
  })
  @IsIn([UserRole.ARTIST])
  role: UserRole;

  @ApiProperty({ example: "The internet's friendliest designer kid." })
  @IsString()
  @MinLength(1)
  @IsOptional()
  bio:string;

  @ApiProperty({ example: 'globeAccLink.com' })
  @IsString()
  @MinLength(5)
  @IsOptional()
  globeAccLink?: string;

  @ApiProperty({ example: 'discordAccLink.com' })
  @IsString()
  @MinLength(5)
  @IsOptional()
  discordAccLink?: string;

  @ApiProperty({ example: 'youtubeAccLink.com' })
  @IsString()
  @MinLength(5)
  @IsOptional()
  youtubeAccLink?: string;

  @ApiProperty({ example: 'twitterAccLink.com' })
  @IsString()
  @MinLength(5)
  @IsOptional()
  twitterAccLink?: string;

  @ApiProperty({ example: 'instagramAccLink.com' })
  @IsString()
  @MinLength(5)
  @IsOptional()
  instagramAccLink?: string;
}
