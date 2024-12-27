import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class SubmitEditRequestDto {
    @IsNumber()
    @IsNotEmpty()
    targetId!: number;
    @IsString()
    @IsNotEmpty()
    proposedChanges!: string
}