import { Controller, Get, UseGuards, Post, Body, Request, Res, Query, } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginDto } from './dto/login-user.dto';
import { Response } from 'express';
import { SpotifyAuthGuard } from './spotify-auth.guard';

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
    @UseGuards(SpotifyAuthGuard)
    async spotifyLogin(@Res() res: Response) {
        const authUrl = await this.authService.getSpotifyAuthUrl();
        res.redirect(authUrl);
    }


    //Callback for Spotify login
    @Post('spotify/callback')
    @UseGuards(SpotifyAuthGuard)
    async spotifyCallback(@Query('code') code: string, @Query('error') error: string, @Res() res: Response) {
        try {
            if (error) {
                console.error('Spotify OAuth Error:', error);
                return res.redirect('/login?error=spotify_auth_failed');
            }

            if (!code) {
                return res.redirect('/login?error=no_auth_code');
            }

            const token = await this.authService.getSpotifyToken(code);
            await this.authService.getSpotifyUserProfile(token.access_token);
            await this.authService.create_or_update_OAuthProvider();
            await this.authService.registerSpotifyUser(token);
            const jwt = await this.authService.loginSpotifyUser(token);
            
            // Redirect with success
            return res.redirect(`/auth/success?token=${jwt}`);
        } catch (error) {
            console.error('Spotify Callback Error:', error);
            return res.redirect('/login?error=auth_failed');
        }
    }

}