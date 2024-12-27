import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AnswerEntity } from 'src/libs/database/entities/answer.entity';
import { QuestionEntity } from 'src/libs/database/entities/question.entity';
import { EditRequestEntity } from 'src/libs/database/entities/edit-request.entity';
import { EditType } from 'src/libs/database/enum/edit-type.enum';
import { EditStatus } from 'src/libs/database/enum/edit-status.enum';

@Injectable()
export class AnswersService {
  constructor(
    @InjectRepository(AnswerEntity)
    private readonly answerRepository: Repository<AnswerEntity>,
    @InjectRepository(QuestionEntity)
    private readonly questionRepository: Repository<QuestionEntity>,
    @InjectRepository(EditRequestEntity)
    private readonly editRequestRepository: Repository<EditRequestEntity>,
  ) { }

  async createAnswer(
    questionId: number,
    text: string,
    userId: number,
  ): Promise<AnswerEntity> {
    const question = await this.questionRepository.findOneBy({ id: questionId });

    if (!question) throw new NotFoundException('Question not found');


    const answer = this.answerRepository.create({
      questionId,
      text,
      createById: userId,
    });

    return this.answerRepository.save(answer);
  }

  async getQuestionAnswers(questionId: number): Promise<AnswerEntity[]> {
    return this.answerRepository.find({
      where: { questionId },
      relations: ['createdBy'],
    });
  }

  async getMyAnswers(userId: number): Promise<AnswerEntity[]> {
    return this.answerRepository.find({
      where: { createById: userId },
      relations: ['question'],
      order: { createdAt: 'DESC' },
    });
  }

  async getAnswerById(id: number): Promise<AnswerEntity> {
    const answer = await this.answerRepository.findOne({
      where: { id },
      relations: ['question', 'createdBy'],
    });

    if (!answer) throw new NotFoundException('Answer not found');

    return answer;
  }

  async deleteAnswer(id: number, userId: number): Promise<void> {
    const answer = await this.answerRepository.findOne({ where: { id } });

    if (!answer) throw new NotFoundException('Answer not found');
    if (answer.createById !== userId) throw new UnauthorizedException('Unauthorized action');

    await this.answerRepository.softRemove(answer);
  }

  async submitEditRequest(
    userId: number,
    targetId: number,
    proposedChanges: string,
  ): Promise<EditRequestEntity> {
    const editRequest = this.editRequestRepository.create({
      requestedById: userId,
      targetType: EditType.answer,
      targetId,
      proposedChanges,
      status: EditStatus.pending,
    });
    return this.editRequestRepository.save(editRequest);
  }

}