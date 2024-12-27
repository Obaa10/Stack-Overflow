import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { JwtPayload } from 'src/app/auth/dto/jwt-payload';
import { User } from 'src/app/auth/decorators/session.decorator';
import { JwtAuthGuard } from 'src/app/auth/strategy/jwt.guard';
import { SubmitEditRequestDto } from './dto/submit-edit-request.dto';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  createPost(@Body() createQuestionDto: CreateQuestionDto, @User() user: JwtPayload) {
    return this.questionsService.createQuestion(createQuestionDto, user.userId);
  }

  @Get(':id')
  getPostById(@Param('id') id: number) {
    return this.questionsService.getById(id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getMyQuestions(@User() user: JwtPayload) {
    return this.questionsService.getMyQuestions(user.userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deletePost(@Param('id') id: number, @User() user: JwtPayload) {
    return this.questionsService.delete(id, user.userId);
  }

  @Post('request-edit')
  @UseGuards(JwtAuthGuard)
  async submitEditRequest(
    @Body() body: SubmitEditRequestDto,
    @User() user: JwtPayload,
  ) {
    return this.questionsService.submitEditRequest(
      user.userId,
      body.targetId,
      body.proposedChanges,
    );
  }

}
