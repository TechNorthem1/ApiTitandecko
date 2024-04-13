import { HttpException, HttpStatus, Injectable } from '@nestjs/common' 
import {QuestionDTO} from './dto/question.dto';
import {QUESTIONS} from 'src/common/models/models';
import {Model} from 'mongoose';
import {InjectModel} from '@nestjs/mongoose';

@Injectable()
export class QuestionsService {
  constructor(@InjectModel(QUESTIONS.name) private readonly model:Model<IQuestions>){}

  // guardar una pregunta realizada
  async create(questionDTO:QuestionDTO):Promise<any>{
    try {
      const question = new this.model(questionDTO);

      question.save();
      return {
        status: HttpStatus.OK,
        message: "La pregunta ha sido guardada"
      }
    }catch(error){
      throw new HttpException("La pregunta no ha sido guardada", HttpStatus.BAD_REQUEST)
    } 
  }

  async listsQuestions():Promise<any>{
    try {
      const questions = await this.model.find();
      if(questions.length < 1) {
        throw new HttpException("No se encontraron preguntas", HttpStatus.NOT_FOUND)
      }
      
      return {
        message: "listado de preguntas",
        questions
      }
    }catch(error){
      throw new HttpException("No se encontraron preguntas", HttpStatus.NOT_FOUND);
  }
  }
}
