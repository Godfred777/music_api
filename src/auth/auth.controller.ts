import { Controller, Get, UseGuards, Post, Body, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '@prisma/client';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RegisterUserDto } from './dto/register-user.dto';


@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    //Login a user
    @Post('login')
    @UseGuards(LocalAuthGuard)
    async login(@Body() user: User) {
        return this.authService.login(user)
    }

    //Registers a user
    @Post('register')
    async register(@Body() userDto: RegisterUserDto) {

        const user: User = {
            id: 0, // or set a default id
            first_name: userDto.first_name,
            last_name: userDto.last_name,
            email: userDto.email,
            password: userDto.password,
            provider_id: 0, // or set a default provider_id
            created_at: new Date(),
            updated_at: new Date()
        };

        return this.authService.register(user)
    }

    //Retrieves a user's profile
    @Get('profile')
    @UseGuards(JwtAuthGuard)
    getProfile(@Request() req) {
        return req.user
    }
}
