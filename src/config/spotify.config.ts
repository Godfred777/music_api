// src/config/spotify.config.ts
export const spotifyConfig = {
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: 'http://localhost:3000/auth/spotify/callback',
  };