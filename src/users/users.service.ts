import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User, Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    /**
     * Retrieves all users from database
     */
    async getAllUsers(): Promise<Partial<User>[]> {
        const users = await this.prisma.user.findMany();
        return users.map(({ password, ...user }) => user);
    }

    /**
     * Retrieves a user by id
     */
    async getUserById(id: number): Promise<User> {
        if (!id) throw new BadRequestException('User ID is required');

        const user = await this.prisma.user.findUnique({
            where: { id }
        });

        if (!user) throw new NotFoundException(`User with ID ${id} not found`);
        return user;
    }

    /**
     * Retrieves a user by email
     */
    async getUserByEmail(email: string): Promise<User> {
        if (!email) throw new BadRequestException('Email is required');

        const user = await this.prisma.user.findUnique({
            where: { email }
        });
        
        return user;
    }

    /**
     * Creates a new user in the database
     */
    async createUser(data: Prisma.UserCreateInput): Promise<User> {
        if (!data.email || !data.password) {
            throw new BadRequestException('Email and password are required');
        }

        return this.prisma.user.create({ data });
    }
}
