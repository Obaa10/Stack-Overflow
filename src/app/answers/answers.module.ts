import { Module } from '@nestjs/common';
import { AnswersService } from './answers.service';
import { AnswersController } from './answers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnswerEntity } from 'src/libs/database/entities/answer.entity';
import { QuestionEntity } from 'src/libs/database/entities/question.entity';
import { EditRequestEntity } from 'src/libs/database/entities/edit-request.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AnswerEntity, QuestionEntity, EditRequestEntity]),
  ],
  controllers: [AnswersController],
  providers: [AnswersService],
})
export class AnswersModule { }
