import { Controller, Get,  Param, Post} from '@nestjs/common';
import { PlaylistsService } from './playlists.service';

@Controller('playlists')
export class PlaylistsController {

    constructor(private readonly playlistService: PlaylistsService) {}

    @Get()
     async findAllPlaylists() {
        try {
            return await this.playlistService.getAllPlaylists();
        } catch (error) {
            return "No playlists available";
        }
    }

    @Get(":id")
    async findOnePlaylist(@Param('id') id: string) {
        try {
            const playlistId: number = parseInt(id);
            return await this.playlistService.getPlaylistById(playlistId);
        } catch (error) {
            return "Playlist not found";
        }
    }

    @Post()
    async create() {
        return await "New playlist created";
    }
}


