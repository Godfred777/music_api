// src/config/spotify.config.ts
export const spotifyConfig = {
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: 'http://localhost:3000/auth/spotify/callback',
    scopes: ['user-read-email', 'user-read-private', 'playlist-read-private', 'playlist-read-collaborative', 'user-library-read', 'user-top-read', 'user-read-playback-state', 'user-read-currently-playing', 'user-modify-playback-state', 'user-read-recently-played', 'user-follow-read', 'user-follow-modify', 'user-library-modify', 'playlist-modify-public', 'playlist-modify-private'],
  };