import { Controller, Get, Query } from '@nestjs/common';
import { SearchQuestionsService } from './search-questions.service';
import { QuestionDto } from 'src/app/questions/dto/question.dto';
import { SearchSimilarQuestionsService } from './search-similar-question.service';

@Controller('search/questions')
export class SearchQuestionsController {
  constructor(
    private readonly searchService: SearchQuestionsService,
    private readonly questionSearchService: SearchSimilarQuestionsService,
  ) { }

  @Get()
  async searchQuestions(
    @Query('searchTerm') searchTerm?: string,
    @Query('createdById') createdById?: number,
    @Query('sortBy') sortBy: 'createdAt' | 'updatedAt' = 'createdAt',
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'DESC',
  ): Promise<QuestionDto[]> {
    return await this.searchService.searchQuestions(
      searchTerm,
      createdById,
      sortBy,
      sortOrder,
    );

  }


  @Get('similar')
  async searchSimilarQuestions(
    @Query('query') query: string,
  ): Promise<QuestionDto[]> {
    if (!query) return [];
    return await this.questionSearchService.searchSimilarQuestion(query);
  }
}