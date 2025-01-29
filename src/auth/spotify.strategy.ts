import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-spotify';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class SpotifyStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,) {
    super({
      clientID: 'YOUR_CLIENT_ID',
      clientSecret: 'YOUR_CLIENT_SECRET',
      callbackURL: 'http://localhost:3000/auth/spotify/callback',
      scope: ['user-read-email', 'user-read-private', 'playlist-read-private', 'playlist-read-collaborative', 'user-library-read', 'user-top-read', 'user-read-playback-state', 'user-read-currently-playing', 'user-modify-playback-state', 'user-read-recently-played', 'user-follow-read', 'user-follow-modify', 'user-library-modify', 'playlist-modify-public', 'playlist-modify-private'],
    });
  }

async validate(accessToken: string, refreshToken: string, profile: any) {
    const { id, displayName, emails } = profile;
    const email = emails[0].value;

    // Check if the user already exists in the database
    let user = await this.userService.getUserByEmail(email);

    if (!user) {
        // If the user does not exist, create a new user
        user = await this.userService.createUser({
            email,
            first_name: displayName.split(' ')[0],
            last_name: displayName.split(' ').slice(1).join(' '),
            password: '',
            provider_id: 1, // Spotify
        });
    } else {
        // If the user exists, update their access and refresh tokens
        user = await this.authService.updateUserTokens(user.id, accessToken, refreshToken);
    }

    return user;
}
}