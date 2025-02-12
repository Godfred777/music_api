import { Injectable } from '@nestjs/common';
import SpotifyWebApi from 'spotify-web-api-node';

@Injectable()
export class SpotifyAuthService {

    private spotifyWebApi: SpotifyWebApi

    constructor() {
        this.spotifyWebApi = new SpotifyWebApi({
            clientId: process.env.SPOTIFY_CLIENT_ID,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
            redirectUri: process.env.SPOTIFY_REDIRECT_URI,
        });
    }

    getAuthUrl(): string {
        const scopes = ['user-read-private', 'user-read-email', 'playlist-read-private', 'playlist-modify-public', 'playlist-modify-private'];
        return this.spotifyWebApi.createAuthorizeURL(scopes, 'random-state-string')
    }
    
    async getTokens(code: string) {
        const data = await this.spotifyWebApi.authorizationCodeGrant(code);
        this.spotifyWebApi.setAccessToken(data.body.access_token);
        this.spotifyWebApi.setRefreshToken(data.body.refresh_token);
        return {
            accessToken: data.body.access_token,
            refreshToken: data.body.refresh_token,
            expiresIn: data.body.expires_in
        }
    }
}
