import { IsNotEmpty, IsString } from 'class-validator';


export class AdminRegisterDto {
    @IsNotEmpty()
    @IsString()
    username!: string
    @IsNotEmpty()
    @IsString()
    password!: string
}