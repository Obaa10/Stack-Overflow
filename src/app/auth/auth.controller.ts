import { Controller, Post, Body, Res, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { Response } from 'express';
import { JwtPayloadWithToken } from './dto/jwt-payload';
import { RefreshTokenGuard } from './strategy/refresh-token/refresh-token.guard';
import { User } from './decorators/session.decorator';
import { UtilService } from '../util/util.service';
import { VerifyEmailInput } from './dto/verify-email.input';
import { VerifyCodeInput } from './dto/verify-code.input';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly utilService: UtilService,
  ) { }

  @Post('verify-email')
  async verifyEmail(@Body() body: VerifyEmailInput): Promise<VerifyEmailDto> {
    return await this.authService.verifyEmail(body.email);
  }

  @Post('verify-code')
  async verifyCode(@Res() res: Response, @Body() body: VerifyCodeInput): Promise<VerifyCodeDto> {
    const verify = await this.authService.verifyCode(body.email, body.code);
    return verify;
  }


  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  async refresh(@Res() res: Response, @User() user: JwtPayloadWithToken) {
    const { accessToken, refreshToken } = await this.authService.refresh(user);
    this.utilService.setTokensAsCookies(res, { accessToken, refreshToken });
  }


}
