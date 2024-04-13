import {ApiProperty} from "@nestjs/swagger";
import { IsString, IsNotEmpty} from "class-validator";

export class QuestionDTO {
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
  @IsNotEmpty()
  @IsString()
  readonly email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly question: string;
  
  @ApiProperty()
  @IsString()
  readonly response: string;
}
