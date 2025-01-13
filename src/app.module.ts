import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SongsModule } from './songs/songs.module';
import { PlaylistsModule } from './playlists/playlists.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [SongsModule, PlaylistsModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
