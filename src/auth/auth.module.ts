import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule, JwtModuleAsyncOptions } from '@nestjs/jwt';
import { GoogleStrategy } from './strategies/google.strategy';
import { AUTH_SERVICE_TOKEN } from './constants/auth.const';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';

const jwtModuleAsyncOptions: JwtModuleAsyncOptions = {
  useFactory: () => ({}),
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
    JwtStrategy,
    JwtRefreshStrategy,
  ],
  exports: [AUTH_SERVICE_TOKEN],
})
export class AuthModule {}
