import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export class sendOtpEmailDto {
    @IsEmail()
    @ApiProperty({ example: 'liviarosser@gmail.com' })
    email: string;
}
