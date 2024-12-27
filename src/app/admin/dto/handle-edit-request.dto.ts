import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { EditStatus } from 'src/libs/database/enum/edit-status.enum';


export class HandleEditRequestDto {
    @IsNotEmpty()
    @IsString()
    action: EditStatus;
    @IsOptional()
    @IsString()
    adminComment?: string
}