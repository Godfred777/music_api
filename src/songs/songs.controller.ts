import { Controller, Get, Param, Post } from '@nestjs/common';

@Controller('songs')
export class SongsController {

    @Get()
    findAll() {
        return "List of songs";
    }

    @Get(":id")
    findSong(@Param("id") id) {
        return `This is the song found ${id}`;
    }

    @Post()
    addSongs() {
        return "New songs";
    }
}
