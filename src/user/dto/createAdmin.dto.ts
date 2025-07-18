import { ApiProperty } from "@nestjs/swagger"
import { UserRole } from "@prisma/client"
import {  IsEmail, IsEnum, IsIn, IsNotEmpty, IsString, IsUUID, Max, MaxLength, Min, MinLength } from "class-validator"

export class CreateAdminrDto {
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

  image: 'default.png'
  
  @ApiProperty({
    example: UserRole.ADMIN,
    enum: [UserRole.ADMIN, UserRole.SUPERADMIN],
  })
  @IsIn([UserRole.ADMIN, UserRole.SUPERADMIN])
  role: UserRole;

}
