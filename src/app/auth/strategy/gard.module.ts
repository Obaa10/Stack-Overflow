import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

@Module({
    imports: [
        PassportModule,
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get('AUTH_TOKEN_JWT_SECRET'),
                global: true,
                signOptions: {
                    expiresIn: configService.get('AUTH_TOKEN_JWT_EXPIRATION'),
                },
            }),
        }),
    ],
    providers: [JwtStrategy]
})
export class GardModule { }
