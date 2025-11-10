import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule, JwtModuleAsyncOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { GoogleStrategy } from './strategies/google.strategy';
import { AUTH_SERVICE_TOKEN } from './constants/auth.const';

const jwtModuleAsyncOptions: JwtModuleAsyncOptions = {
  inject: [ConfigService],
  /*@ts-expect-error using Joi thats why configService.get<string> works*/
  useFactory: (configService: ConfigService) => ({
    secret: configService.get<string>('jwt.secret'),
    signOptions: {
      expiresIn: configService.get<string>('jwt.expiresIn'),
    },
  }),
};

@Module({
  imports: [UsersModule, JwtModule.registerAsync(jwtModuleAsyncOptions)],
  controllers: [AuthController],
  providers: [
    {
      provide: AUTH_SERVICE_TOKEN,
      useClass: AuthService,
    },
    GoogleStrategy,
  ],
  exports: [AUTH_SERVICE_TOKEN],
})
export class AuthModule {}
