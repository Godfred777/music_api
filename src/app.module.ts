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

@Module({
  imports: [SongsModule, PlaylistsModule, UsersModule, ConfigModule.forRoot(), PrismaModule, AuthModule, OauthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
