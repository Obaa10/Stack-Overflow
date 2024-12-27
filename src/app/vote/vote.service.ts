import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VoteEntity } from 'src/libs/database/entities/votes.entity';
import { QuestionEntity } from 'src/libs/database/entities/question.entity';
import { AnswerEntity } from 'src/libs/database/entities/answer.entity';
import { Repository } from 'typeorm';

@Injectable()
export class VoteService {
  constructor(
    @InjectRepository(VoteEntity) private voteRepository: Repository<VoteEntity>,
    @InjectRepository(QuestionEntity) private questionRepository: Repository<QuestionEntity>,
    @InjectRepository(AnswerEntity) private answerRepository: Repository<AnswerEntity>,
  ) { }

  async voteQuestion(userId: number, questionId: number, vote: 1 | -1): Promise<void> {
    const question = await this.questionRepository.findOne({ where: { id: questionId } });
    if (!question) throw new NotFoundException('Question not found');

    const existingVote = await this.voteRepository.findOne({ where: { userId, questionId } });
    if (existingVote) {
      const voteDifference = vote - existingVote.vote;
      existingVote.vote = vote;
      await this.voteRepository.save(existingVote);
      question.totalVotes += voteDifference;
    } else {
      const newVote = this.voteRepository.create({ userId, questionId, vote });
      await this.voteRepository.save(newVote);
      question.totalVotes += vote;
    }

    await this.questionRepository.save(question);
  }


  async voteAnswer(userId: number, answerId: number, vote: 1 | -1): Promise<void> {
    const answer = await this.answerRepository.findOneBy({ id: answerId });
    if (!answer) throw new NotFoundException('Answer not found');

    const existingVote = await this.voteRepository.findOne({ where: { userId, answerId } });
    if (existingVote) {
      const voteDifference = vote - existingVote.vote;
      existingVote.vote = vote;
      await this.voteRepository.save(existingVote);
      answer.totalVotes += voteDifference;
    } else {
      const newVote = this.voteRepository.create({ userId, answerId, vote });
      await this.voteRepository.save(newVote);
      answer.totalVotes += vote;
    }

    await this.answerRepository.save(answer);

  }
}