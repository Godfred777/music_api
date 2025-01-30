import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SongsModule } from './songs/songs.module';
import { PlaylistsModule } from './playlists/playlists.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { OauthModule } from './oauth/oauth.module';
import { SpotifyAuthService } from './spotify-auth/spotify-auth.service';
import { SpotifyAuthController } from './spotify-auth/spotify-auth.controller';
import { SpotifyAuthModule } from './spotify-auth/spotify-auth.module';

@Module({
  imports: [SongsModule, PlaylistsModule, UsersModule, ConfigModule.forRoot(), PrismaModule, AuthModule, OauthModule, SpotifyAuthModule],
  controllers: [AppController, SpotifyAuthController],
  providers: [AppService, SpotifyAuthService],
})
export class AppModule {}
