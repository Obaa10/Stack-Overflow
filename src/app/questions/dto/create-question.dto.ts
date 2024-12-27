import { IsNotEmpty, IsString } from "class-validator";

export class CreateQuestionDto {
    @IsString()
    @IsNotEmpty()
    title!: string;
    @IsString()
    @IsNotEmpty()
    description!: string;
    topics: string[];
}