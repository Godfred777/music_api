import { Controller, Get, Query, Redirect } from '@nestjs/common';
import { SpotifyAuthService } from './spotify-auth.service';

@Controller('auth/spotify')
export class SpotifyAuthController {
  constructor(private readonly spotifyAuthService: SpotifyAuthService) {}

  // Redirect to Spotify Authorization URL
  @Get('login')
  @Redirect()
  login() {
    return { url: this.spotifyAuthService.getAuthUrl() };
  }

  // Callback for Spotify OAuth2
  @Get('callback')
  async callback(@Query('code') code: string) {
    const tokens = await this.spotifyAuthService.getAccessToken(code);
    return { message: 'Successfully authenticated!', tokens };
  }
}
