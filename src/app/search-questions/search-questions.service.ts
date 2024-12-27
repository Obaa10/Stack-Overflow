import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Like, Repository } from 'typeorm';
import { QuestionEntity } from 'src/libs/database/entities/question.entity';

@Injectable()
export class SearchQuestionsService {
  constructor(
    @InjectRepository(QuestionEntity)
    private readonly questionRepository: Repository<QuestionEntity>,
  ) { }

  async searchQuestions(
    searchTerm?: string,
    createdById?: number,
    sortBy: 'createdAt' | 'updatedAt' = 'createdAt',
    sortOrder: 'ASC' | 'DESC' = 'DESC',
  ): Promise<QuestionEntity[]> {
    const whereConditions: any = {}; 

    if (searchTerm) {
      whereConditions.title = Like(`%${searchTerm}%`);  // Search in title
      whereConditions.description = Like(`%${searchTerm}%`);  // Search in description
    }
  
   
    // Filter by createdById if provided
    if (createdById) {
      whereConditions.createById = createdById;
    }
  
    // Using `find` to retrieve the results with the dynamic where conditions
    const questions = await this.questionRepository.find({
      where: whereConditions,
      relations: ['topics', 'createdBy'],  // Ensure relations are loaded
      order: {
        [sortBy]: sortOrder,  // Dynamically apply sorting
      },
    });
  
    return questions;
  }
}