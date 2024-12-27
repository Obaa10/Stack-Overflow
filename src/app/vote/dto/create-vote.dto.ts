import { IsNotEmpty, IsNumber, IsIn } from 'class-validator';

export class CreateVoteDto {
  @IsNotEmpty()
  @IsNumber()
  userId!: number;

  @IsNotEmpty()
  @IsIn([1, -1])
  vote!: 1 | -1;
}