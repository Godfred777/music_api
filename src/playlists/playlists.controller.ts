import { Controller, Get,  Param, Post} from '@nestjs/common';

@Controller('playlists')
export class PlaylistsController {

    @Get()
    findAll() {
        return "This are playlists";
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


