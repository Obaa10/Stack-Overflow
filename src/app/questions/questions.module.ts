import { Module } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionEntity } from 'src/libs/database/entities/question.entity';
import { TopicEntity } from 'src/libs/database/entities/topic.entity';
import { EditRequestEntity } from 'src/libs/database/entities/edit-request.entity';
import { AnswerEntity } from 'src/libs/database/entities/answer.entity';
import { SearchModule } from '../search-questions/search-questions.module';
import { AIService } from 'src/libs/ai/ai.service';

@Module({
  imports: [
    SearchModule,
    TypeOrmModule.forFeature([QuestionEntity, TopicEntity, EditRequestEntity, AnswerEntity]),
  ],
  controllers: [QuestionsController],
  providers: [QuestionsService,AIService],
})
export class QuestionsModule { }
