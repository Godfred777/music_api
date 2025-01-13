import { Controller, Get, Post } from '@nestjs/common';

@Controller('songs')
export class SongsController {

    @Get()
    findAll() {
        return "List of songs";
    }

    @Post()
    addSongs() {
        return "New songs";
    }
}
