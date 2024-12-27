import { Controller, Post, Body, Param, Delete, Get, UseGuards } from '@nestjs/common';
import { AnswersService } from './answers.service';
import { User } from 'src/app/auth/decorators/session.decorator';
import { JwtPayload } from 'src/app/auth/dto/jwt-payload';
import { JwtAuthGuard } from 'src/app/auth/strategy/jwt.guard';
import { SubmitEditRequestDto } from '../questions/dto/submit-edit-request.dto';

@Controller('answers')
export class AnswersController {
  constructor(private readonly answersService: AnswersService) { }

  @Post(':questionId')
  @UseGuards(JwtAuthGuard)
  createAnswer(
    @Param('questionId') questionId: number,
    @Body('text') text: string,
    @User() user: JwtPayload,
  ) {
    return this.answersService.createAnswer(questionId, text, user.userId);
  }

  @Get('/question/:questionId')
  getQuestionAnswers(@Param('questionId') questionId: number) {
    return this.answersService.getQuestionAnswers(questionId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getMyAnswers(@User() user: JwtPayload) {
    return this.answersService.getMyAnswers(user.userId);
  }

  @Get(':id')
  getAnswerById(@Param('id') id: number) {
    return this.answersService.getAnswerById(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deleteAnswer(@Param('id') id: number, @User() user: JwtPayload) {
    return this.answersService.deleteAnswer(id, user.userId);
  }

  @Post('request-edit')
  @UseGuards(JwtAuthGuard)
  async submitEditRequest(
    @Body() body: SubmitEditRequestDto,
    @User() user: JwtPayload,
  ) {
    return this.answersService.submitEditRequest(
      user.userId,
      body.targetId,
      body.proposedChanges,
    );
  }
}