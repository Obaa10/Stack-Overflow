import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { Repository } from 'typeorm';
import { VerifyCodeDto } from './dto/verify-code.dto';
import * as bcrypt from 'bcrypt';
import { JwtPayloadWithToken } from './dto/jwt-payload';
import { UserEntity } from 'src/libs/database/entities/user.entity';
import { RedisService } from 'src/libs/redis/redis.service';
import { UtilService } from '../util/util.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    readonly utilService: UtilService,
    readonly redisService: RedisService,
  ) { }

  async verifyEmail(email: string): Promise<VerifyEmailDto> {
    const userExists = await this.userRepository.exists({ where: { email }, withDeleted: true });
    await this.sendVerificationCode(email);
    return { isExistingUser: userExists }
  }

  private async sendVerificationCode(email: string): Promise<void> {
    const otp = this.utilService.generateOtp();
    
    await this.redisService.saveVerificationCode(email, otp);
    this.utilService.sendEmail(email, 'Verification Code', `Your verification code is: ${otp}`);
  }


  async verifyCode(email: string, code: string): Promise<VerifyCodeDto> {
    await this.redisService.verifyOtp(email, code)
    const user = await this.findOrCreateUser(email)

    const { accessToken, refreshToken } = this.utilService.generateTokens({ userId: user.id, email: user.email });
    this.updateRefreshToken(user.id, refreshToken);

    return { email, user, accessToken, refreshToken };
  }

  async refresh(payload: JwtPayloadWithToken) {
    const user = await this.userRepository.findOne({ where: { id: payload.userId } });
    if (!user?.hashedRefreshToken) throw new ForbiddenException('Access denied');

    const refreshTokenMatches = await bcrypt.compare(payload.token, user.hashedRefreshToken);
    if (!refreshTokenMatches) throw new ForbiddenException('Access denied');

    const { accessToken, refreshToken } = this.utilService.generateTokens({
      userId: user.id,
      email: user.email,
    });

    await this.updateRefreshToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }


  private async updateRefreshToken(userId: number, refreshToken: string | null) {
    const SALT_ROUNDS = 10;
    const hashedRefreshToken = refreshToken
      ? await bcrypt.hash(refreshToken, SALT_ROUNDS)
      : null;
    await this.userRepository.update(userId, { hashedRefreshToken });
  }

  private async findOrCreateUser(email: string): Promise<UserEntity> {
    let user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      user = this.userRepository.create({ email });
      await this.userRepository.save(user);
    }

    return user;
  }

}
