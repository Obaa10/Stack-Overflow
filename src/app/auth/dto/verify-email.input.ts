import { IsNotEmpty, IsString } from "class-validator";

export class VerifyEmailInput {
    @IsNotEmpty()
    @IsString()
    email!: string
}
