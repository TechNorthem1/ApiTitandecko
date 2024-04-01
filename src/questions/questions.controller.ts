import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { QuestionDTO } from './dto/question.dto';
import { ApiOperation, ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags("Preguntas")
@Controller('/api/v1/questions')
export class QuestionsController {
  constructor(private readonly questionService:QuestionsService){}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({summary: "generar pregunta"})
  create(@Body() questionDTO:QuestionDTO){
    return this.questionService.create(questionDTO);
  }


  @Get()
  @ApiOperation({summary: "Listar preguntas"})
  find(){
    return this.questionService.listsQuestions();
  }
}
