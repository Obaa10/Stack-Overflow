import { IsNotEmpty, IsString } from "class-validator";

export class VerifyCodeInput {
    @IsNotEmpty()
    @IsString()
    email!: string
    @IsNotEmpty()
    @IsString()
    code!: string
}
