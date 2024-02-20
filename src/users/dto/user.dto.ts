import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UserDTO {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    readonly lastname: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    readonly phone: string;

    @ApiProperty()
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    readonly citizenshipCard: string;

    @ApiProperty()
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    readonly address?: string;

    @ApiProperty()
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    readonly address1?: string

    @ApiProperty()
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    readonly address2?: string;

    @ApiProperty()
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    readonly address3?: string;

    @ApiProperty()
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    readonly avenue?: string;

    @ApiProperty()
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    readonly complement_information?: string;
    
    @ApiProperty()
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    readonly departament?: string;

    @ApiProperty()
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    readonly document?: string;

    @ApiProperty()
    @IsOptional()
    @IsNotEmpty()
    @IsEmail()
    readonly email_send?: string;

    @ApiProperty()
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    readonly information_aditional?: string;

    @ApiProperty()
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    readonly method?: string;

    @ApiProperty()
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    readonly municipaly?: string;

    @ApiProperty()
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    readonly neighborhood?: string;
}