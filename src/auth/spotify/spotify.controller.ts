import { Controller, Get, Query, Redirect } from '@nestjs/common';
import { SpotifyAuthService } from './spotify.service';

@Controller('auth/spotify')
export class SpotifyAuthController {

    constructor(private readonly spotifyAuthService: SpotifyAuthService) {}

    @Get('login')
    @Redirect()
    login() {
        return {url: this.spotifyAuthService.getAuthUrl()};
    }

    @Get('callback')
    async callback(@Query('code') code: string) {
        try {
            const tokens = await this.spotifyAuthService.getTokens(code);
            return tokens;
        } catch (error) {
           console.log(error); 
        }
        
    }

}
