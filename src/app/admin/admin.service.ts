import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminEntity } from 'src/libs/database/entities/admin.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { EditRequestEntity } from 'src/libs/database/entities/edit-request.entity';
import { EditStatus } from 'src/libs/database/enum/edit-status.enum';
import { EditType } from 'src/libs/database/enum/edit-type.enum';
import { QuestionEntity } from 'src/libs/database/entities/question.entity';
import { AnswerEntity } from 'src/libs/database/entities/answer.entity';
import { UtilService } from '../util/util.service';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AdminEntity)
    private readonly adminRepository: Repository<AdminEntity>,
    @InjectRepository(EditRequestEntity)
    private readonly editRequestRepository: Repository<EditRequestEntity>,
    @InjectRepository(QuestionEntity)
    private readonly questionRepository: Repository<QuestionEntity>,
    @InjectRepository(AnswerEntity)
    private readonly answerRepository: Repository<AnswerEntity>,
    private readonly utilService: UtilService,
  ) { }

  async validateAdmin(username: string, password: string): Promise<AdminEntity | null> {
    const admin = await this.adminRepository.findOneBy({ username });
    if (admin && await bcrypt.compare(password, admin.password)) {
      const { password, ...result } = admin;
      return result;
    }
    return null;
  }

  async login(admin: AdminEntity) {
    const { accessToken } = this.utilService.generateTokens({ userId: admin.id });
    return {
      access_token: accessToken
    };
  }

  async createAdmin(username: string, password: string): Promise<AdminEntity> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = this.adminRepository.create({ username, password: hashedPassword });
    return this.adminRepository.save(newAdmin);
  }

  async handleEditRequest(
    requestId: number,
    action: EditStatus,
    adminComment?: string,
  ): Promise<void> {
    const request = await this.editRequestRepository.findOneBy({ id: requestId });

    if (!request) throw new Error('Edit request not found');

    if (action === EditStatus.approved) {
      if (request.targetType === EditType.question) {
        await this.questionRepository.update(
          request.targetId,
          { description: request.proposedChanges },
        );
      } else if (request.targetType === EditType.answer) {
        await this.answerRepository.update(
          { id: request.targetId },
          { text: request.proposedChanges },
        );
      }
      request.status = EditStatus.approved;
    } else {
      request.status = EditStatus.rejected;
    }

    request.adminComment = adminComment;
    await this.editRequestRepository.save(request);
  }
}
