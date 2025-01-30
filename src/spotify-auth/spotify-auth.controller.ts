import { BadRequestException, Controller, Get, Query, Redirect, UnauthorizedException } from '@nestjs/common';
import { SpotifyAuthService } from './spotify-auth.service';

interface SpotifyCallbackQuery {
  code: string;
  state: string;
  error?: string;
}

@Controller('auth/spotify')
export class SpotifyAuthController {
  constructor(private readonly spotifyAuthService: SpotifyAuthService) {}

  @Get('login')
  @Redirect()
  login() {
    return { url: this.spotifyAuthService.getAuthUrl() };
  }

  @Get('callback')
  async callback(@Query() query: SpotifyCallbackQuery) {
    // Check for OAuth error
    if (query.error) {
      throw new UnauthorizedException(query.error);
    }

    // Validate required parameters
    if (!query.code || !query.state) {
      throw new BadRequestException('Missing required parameters');
    }

    try {
      const tokens = await this.spotifyAuthService.getAccessToken(query.code);
      return { 
        success: true,
        message: 'Authentication successful'
        // Don't expose tokens in response
      };
    } catch (error) {
      throw new UnauthorizedException('Failed to authenticate with Spotify');
    }
  }
}
