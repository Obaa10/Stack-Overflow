import { Module } from '@nestjs/common';
import { SearchQuestionsController } from './search-questions.controller';
import { SearchQuestionsService } from './search-questions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionEntity } from 'src/libs/database/entities/question.entity';
import { SearchSimilarQuestionsService } from './search-similar-question.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([QuestionEntity]),
  ],
  controllers: [SearchQuestionsController],
  providers: [SearchQuestionsService,SearchSimilarQuestionsService],
  exports:[SearchSimilarQuestionsService]
})
export class SearchModule { }
