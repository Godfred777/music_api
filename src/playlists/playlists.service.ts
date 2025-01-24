import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PlaylistsService {
    constructor(private prisma: PrismaService) {}

    async getAllPlaylists() {
        try {
            return await this.prisma.playlist.findMany();
        } catch (error) {
            throw error;
        }
    }

    async getPlaylistById(id: number) {
        try {
            return await this.prisma.playlist.findUnique({
                where: {
                    id: id
                }
            });
        } catch (error) {
            throw error;
        }
    }
}
