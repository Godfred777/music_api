
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { AuthController } from './auth.controller';
import { OauthModule } from 'src/oauth/oauth.module';
import { SpotifyAuthService } from 'src/spotify-auth/spotify-auth.service';
import { SpotifyAuthController } from 'src/spotify-auth/spotify-auth.controller';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),OauthModule
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, SpotifyAuthService],
  exports: [AuthService],
  controllers: [AuthController, SpotifyAuthController],
})
export class AuthModule {}
