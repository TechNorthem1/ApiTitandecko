import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class AuthDTO {
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    readonly name: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    readonly lastname: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    readonly phone: string;

    
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    readonly email: string;

    
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    readonly password: string;
}