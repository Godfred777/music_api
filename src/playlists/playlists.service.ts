import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PlaylistsService {
    constructor(private prisma: PrismaService) {}

    async getPlaylists() {
        try {
            return await this.prisma.playlist.findMany();
        } catch (error) {
            throw error;
        }
    }
}
