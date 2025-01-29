import { Controller, Get, UseGuards, Post, Body, Request, Res, Query, } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginDto } from './dto/login-user.dto';
import { spotifyConfig } from 'src/config/spotify.config';
import { Response } from 'express';
import axios from 'axios';
import { error } from 'console';

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

    //Redirects to Spotify login
    @Get('spotify')
    async spotifyLogin(@Res() res: Response) {
        const scope = ['user-read-email', 'user-read-private', 'playlist-read-private', 'playlist-read-collaborative', 'user-library-read', 'user-top-read', 'user-read-playback-state', 'user-read-currently-playing', 'user-modify-playback-state', 'user-read-recently-played', 'user-follow-read', 'user-follow-modify', 'user-library-modify', 'playlist-modify-public', 'playlist-modify-private'];
        const authUrl = await this.authService.getSpotifyAuthUrl(scope);
        res.redirect(authUrl);
    }    


    //Callback for Spotify login
    @Get('spotify/callback')
    async callback(@Query('code') code: string, @Res() res: Response) {
        try {
            if (error) {
                console.error(error)
                res.redirect('/login')
            }

            const token = await this.authService.getSpotifyToken(code);
            await this.authService.getSpotifyUserProfile(token.access_token);
            await this.authService.create_or_update_OAuthProvider();
            await this.authService.registerSpotifyUser(token);
            const jwt = await this.authService.loginSpotifyUser(token);
            return jwt;
        } catch (error) {
            return error;
        }
  }

}