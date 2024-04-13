import { Module } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import {QuestionsController} from './questions.controller';
import {MongooseModule} from '@nestjs/mongoose';
import {QUESTIONS} from 'src/common/models/models';
import {questionSchema} from './schemas/question.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([{
      name: QUESTIONS.name,
      useFactory: () => {return questionSchema},
    }])
  ],
  providers: [QuestionsService],
  controllers: [QuestionsController]
})
export class QuestionsModule {}
