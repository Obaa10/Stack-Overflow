import { Injectable } from '@nestjs/common';
import { JwtPayload } from '../auth/dto/jwt-payload';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import nodemailer from 'nodemailer';

@Injectable()
export class UtilService {
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }


    async sendEmail(email: string, subject: string, message: string): Promise<void> {
        try {
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: this.configService.get('EMAIL_USER'),
                    pass: this.configService.get('EMAIL_PAS')
                }
            });
            let mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: subject,
                text: message
            };

            await transporter.sendMail(mailOptions);
        } catch (error) {
            console.error('Error sending email: ', error);
        }
    }


    generateTokens(payload: JwtPayload) {
        const accessToken = this.jwtService.sign(payload, {
            secret: this.configService.get('AUTH_TOKEN_JWT_SECRET'),
            expiresIn: this.configService.get('AUTH_TOKEN_JWT_EXPIRATION'),
        });

        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get('AUTH_REFRESH_TOKEN_JWT_SECRET'),
            expiresIn: this.configService.get('AUTH_REFRESH_TOKEN_JWT_EXPIRATION'),
        });

        return { accessToken, refreshToken };
    }

    generateOtp(): string {
        return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit OTP
    }


    setTokensAsCookies(
        res: Response,
        tokens: { accessToken: string; refreshToken: string },
    ) {
        const { accessToken, refreshToken } = tokens;
        res.cookie(this.configService.get('AUTH_TOKEN_COOKIE_NAME'), accessToken, {
            domain: this.configService.get('AUTH_TOKEN_COOKIE_DOMAIN'),
            maxAge: this.configService.get('AUTH_TOKEN_COOKIE_MAX_AGE_MS'),
            httpOnly: true,
            secure: this.configService.get('NODE_ENV') === 'production',
            sameSite: 'strict',
        });

        res.cookie(
            this.configService.get('AUTH_REFRESH_TOKEN_COOKIE_NAME'),
            refreshToken,
            {
                domain: this.configService.get('AUTH_TOKEN_COOKIE_DOMAIN'),
                maxAge: this.configService.get('AUTH_REFRESH_TOKEN_COOKIE_MAX_AGE_MS'),
                httpOnly: true,
                secure: this.configService.get('NODE_ENV') === 'production',
                sameSite: 'strict',
            },
        );
    }



}
