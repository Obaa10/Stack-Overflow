import { UserDto } from "src/app/auth/dto/user.dto";
import { QuestionDto } from "src/app/questions/dto/question.dto";

export class AnswerDto {
  id: number;
  text: string;
  question: [QuestionDto];
  createdBy: UserDto;
  totalVotes?: number;
  createdAt: Date;
  updatedAt?: Date;
}