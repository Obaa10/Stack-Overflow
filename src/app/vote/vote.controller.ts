import { Controller, Post, Body, Param } from '@nestjs/common';
import { VoteService } from './vote.service';
import { CreateVoteDto } from './dto/create-vote.dto';

@Controller('votes')
export class VoteController {
  constructor(private voteService: VoteService) { }

  @Post('question/:id')
  async voteQuestion(
    @Param('id') questionId: number,
    @Body() createVoteDto: CreateVoteDto,
  ) {
    await this.voteService.voteQuestion(createVoteDto.userId, questionId, createVoteDto.vote);
  }

  @Post('answer/:id')
  async voteAnswer(
    @Param('id') answerId: number,
    @Body() createVoteDto: CreateVoteDto,
  ) {
    await this.voteService.voteAnswer(createVoteDto.userId, answerId, createVoteDto.vote);
  }
}