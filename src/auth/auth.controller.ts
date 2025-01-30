import { Controller, Get, UseGuards, Post, Body, Request, Res, Query, } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginDto } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    //Login a user
    @Post('login')
    @UseGuards(LocalAuthGuard)
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto)
    }

    //Registers a user
    @Post('register')
    async register(@Body() userDto: RegisterUserDto) {
        return this.authService.register(userDto)
    }

    //Retrieves a user's profile
    @Get('profile')
    @UseGuards(JwtAuthGuard)
    getProfile(@Request() req) {
        return req.user
    }

    //Logs out a user
    @Post('logout')
    @UseGuards(JwtAuthGuard)
    async logout(@Request() req) {
        return this.authService.logout(req.user)
    }
}