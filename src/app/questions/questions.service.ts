import { Injectable, NotFoundException, UnauthorizedException, UseGuards } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { JwtAuthGuard } from 'src/app/auth/strategy/jwt.guard';
import { InjectRepository } from '@nestjs/typeorm';
import { QuestionEntity } from 'src/libs/database/entities/question.entity';
import { In, Repository } from 'typeorm';
import { TopicEntity } from 'src/libs/database/entities/topic.entity';
import { EditRequestEntity } from 'src/libs/database/entities/edit-request.entity';
import { EditType } from 'src/libs/database/enum/edit-type.enum';
import { EditStatus } from 'src/libs/database/enum/edit-status.enum';
import { AIService } from '../../libs/ai/ai.service';
import { AnswerEntity } from 'src/libs/database/entities/answer.entity';
import { SearchSimilarQuestionsService } from '../search-questions/search-similar-question.service';


@Injectable()
@UseGuards(JwtAuthGuard)
export class QuestionsService {
  constructor(
    @InjectRepository(QuestionEntity)
    private readonly questionRepository: Repository<QuestionEntity>,
    @InjectRepository(TopicEntity)
    private readonly topicRepository: Repository<TopicEntity>,
    @InjectRepository(EditRequestEntity)
    private readonly editRequestRepository: Repository<EditRequestEntity>,
    @InjectRepository(AnswerEntity)
    private readonly answerRepository: Repository<AnswerEntity>,
    private readonly aiService: AIService,
    private readonly searchSimilarQuestionsService: SearchSimilarQuestionsService,
  ) { }

  async createQuestion(createQuestionDto: CreateQuestionDto, userId: number): Promise<QuestionEntity> {
    const { topics, ...questionData } = createQuestionDto;

    const topicEntities = await this.fetchOrCreateTopics(topics);

    const question = this.questionRepository.create({
      ...questionData,
      createById: userId,
      topics: topicEntities,
    });
    const savedQuestion = await this.questionRepository.save(question);

    this.searchSimilarQuestionsService.addQuestionToTFIDF(savedQuestion).then();
    this.aiService.generateAnswer(questionData.description).then((aiAnswer) => {
      const answer = this.answerRepository.create({
        text: aiAnswer,
        questionId: savedQuestion.id,
        createById: 0, // Use 0 or a predefined ID for "AI" as the author
      });
      this.answerRepository.save(answer).then();
    });

    return savedQuestion;
  }

  async delete(postId: number, userId: number): Promise<void> {
    const post = await this.questionRepository.findOne({
      where: { id: postId },
      relations: ['answers'],
    });

    if (!post) throw new NotFoundException();
    if (post.createById !== userId) throw new UnauthorizedException();

    if (post.answers && post.answers.length > 0) {
      for (const answer of post.answers) {
        await this.questionRepository.softRemove(answer);
      }
    }

    await this.questionRepository.softRemove(post);
  }

  async getById(id: number): Promise<QuestionEntity> {
    const question = await this.questionRepository.findOne({
      where: { id },
      relations: ['createdBy', 'answers', 'tags'],
    });

    if (!question) throw new NotFoundException();

    return question;
  }

  async getMyQuestions(userId: number): Promise<QuestionEntity[]> {
    return this.questionRepository.find({
      where: { createById: userId },
      relations: ['tags', 'answers'],
      order: { id: 'DESC' },
    });
  }

  async submitEditRequest(
    userId: number,
    targetId: number,
    proposedChanges: string,
  ): Promise<EditRequestEntity> {
    const editRequest = this.editRequestRepository.create({
      requestedById: userId,
      targetType: EditType.question,
      targetId,
      proposedChanges,
      status: EditStatus.pending,
    });
    return this.editRequestRepository.save(editRequest);
  }


  private async fetchOrCreateTopics(topicNames: string[]): Promise<TopicEntity[]> {
    const existingTopics = await this.topicRepository.find({
      where: { name: In(topicNames) },
    });
    const existingTopicNames = existingTopics.map((topic) => topic.name);
    const newTopics = topicNames
      .filter((name) => !existingTopicNames.includes(name))
      .map((name) => this.topicRepository.create({ name }));
    const savedTopics = await this.topicRepository.save(newTopics);
    return [...existingTopics, ...savedTopics];
  }
}