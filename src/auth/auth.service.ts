import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Prisma, User } from '@prisma/client';
import { RegisterUserDto } from './dto/register-user.dto';

interface JwtPayload {
  username: string;
  sub: number;
}

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async validateUser(email: string, password: string) {
        if (!email || !password) {
            throw new BadRequestException('Email and password are required');
        }
        
        const user = await this.usersService.getUserByEmail(email);
        if (user && await bcrypt.compare(password, user.password)) {
            const {password, ...result} = user;
            return result;
        }
        throw new UnauthorizedException('Invalid credentials');
    }

    async login(user: User) {
        const payload: JwtPayload = { 
            username: user.email, 
            sub: user.id 
        };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async register(userDto: RegisterUserDto) {

        const existingUser = await this.usersService.getUserByEmail(userDto.email);
        if (existingUser) {
            throw new ConflictException('User already exists');
        }

        try {
            const hashedPassword = await bcrypt.hash(userDto.password, 10);

            const userData: Prisma.UserCreateInput = {
                first_name: userDto.first_name,
                last_name: userDto.last_name,
                email: userDto.email,
                password: hashedPassword,
                created_at: new Date(),
                updated_at: new Date(),
            };

            const newUser = await this.usersService.createUser(userData);
            const {password, ...result} = newUser;
            return result;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
}