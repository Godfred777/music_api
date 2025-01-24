import { Controller, Get,  Param, Post} from '@nestjs/common';
import { PlaylistsService } from './playlists.service';

@Controller('playlists')
export class PlaylistsController {

    constructor(private readonly playlistService: PlaylistsService) {}

    @Get()
    findAll() {
        try {
            return this.playlistService.getAllPlaylists();
        } catch (error) {
            return "No playlists available";
        }
    }

    @Get(":id")
    findOne(@Param('id') id: string) {
        try {
            const playlistId: number = parseInt(id);
            return this.playlistService.getPlaylistById(playlistId);
        } catch (error) {
            return "Playlist not found";
        }
    }

    @Post()
    create() {
        return "New playlist created";
    }
}


