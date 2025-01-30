import { Injectable } from '@nestjs/common';
import SpotifyWebApi from 'spotify-web-api-node';

@Injectable()
export class SpotifyAuthService {
  private spotifyApi: SpotifyWebApi;

  constructor() {
    this.spotifyApi = new SpotifyWebApi({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      redirectUri: process.env.SPOTIFY_REDIRECT_URI,
    });
  }

  // Get Spotify Authorization URL
  getAuthUrl(): string {
    const scopes = ['user-read-private', 'user-read-email', 'playlist-read-private'];
    return this.spotifyApi.createAuthorizeURL(scopes, 'random-state-string');
  }

  // Exchange code for access token
  async getAccessToken(code: string) {
    const data = await this.spotifyApi.authorizationCodeGrant(code);
    this.spotifyApi.setAccessToken(data.body.access_token);
    this.spotifyApi.setRefreshToken(data.body.refresh_token);

    return {
      accessToken: data.body.access_token,
      refreshToken: data.body.refresh_token,
      expiresIn: data.body.expires_in,
    };
  }
}
