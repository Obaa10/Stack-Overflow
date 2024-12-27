import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminEntity } from 'src/libs/database/entities/admin.entity';
import { EditRequestEntity } from 'src/libs/database/entities/edit-request.entity';
import { AnswerEntity } from 'src/libs/database/entities/answer.entity';
import { QuestionEntity } from 'src/libs/database/entities/question.entity';
import { UtilsModule } from '../util/util.module';

@Module({
  imports: [
    UtilsModule,
    TypeOrmModule.forFeature([AdminEntity, EditRequestEntity, QuestionEntity, AnswerEntity]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule { }
