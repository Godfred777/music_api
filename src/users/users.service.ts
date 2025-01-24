import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    async getAllUsers() {
        try {
            return await this.prisma.user.findMany();
        } catch (error) {
            throw error;
        }
    }

    async getUserById(id: number) {
        try {
            return await this.prisma.user.findUnique({
                where: {
                    id: id
                }
            });
        } catch (error) {
            throw error;
        }
    }
}
