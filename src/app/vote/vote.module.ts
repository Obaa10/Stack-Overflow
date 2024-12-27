import { Module } from '@nestjs/common';
import { VoteService } from './vote.service';
import { VoteController } from './vote.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VoteEntity } from 'src/libs/database/entities/votes.entity';
import { QuestionEntity } from 'src/libs/database/entities/question.entity';
import { AnswerEntity } from 'src/libs/database/entities/answer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([VoteEntity, QuestionEntity, AnswerEntity]),
  ],
  controllers: [VoteController],
  providers: [VoteService],
})
export class VoteModule { }
