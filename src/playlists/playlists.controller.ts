import { Controller, Get,  Param, Post} from '@nestjs/common';
import { PlaylistsService } from './playlists.service';

@Controller('playlists')
export class PlaylistsController {

    constructor(private readonly playlistService: PlaylistsService) {}

    @Get()
    findAll() {
        try {
            return this.playlistService.getPlaylists();
        } catch (error) {
            return "No playlists available";
        }
    }

    @Get(":id")
    findOne(@Param() id) {
        return `This is a playlist ${id}`;
    }

    @Post()
    create() {
        return "New playlist created";
    }
}


