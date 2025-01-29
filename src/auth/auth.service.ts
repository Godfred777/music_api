import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginDto } from './dto/login-user.dto';
import { spotifyConfig } from 'src/config/spotify.config';
import axios from 'axios';
import { OauthService } from 'src/oauth/oauth.service';

interface JwtPayload {
  username: string;
  sub: number;
}

export interface SpotifyUserProfile {
    id: string;
    email: string;
    display_name: string;
}

export interface SpotifyTokenResponse {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    token_type: string;
}

@Injectable()
export class AuthService {
    
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private oauthService: OauthService,
    ) {}

    async validateUser(email: string, password: string) {
        if (!email || !password) {
            throw new BadRequestException('Email and password are required');
        }
        
        const user = await this.usersService.getUserByEmail(email);
        if (user && await bcrypt.compare(password, user.password)) {
            const {password, ...result} = user;
            return result;
        }
        throw new UnauthorizedException('Invalid credentials');
    }

    async login(loginDto: LoginDto) {
        const user = await this.validateUser(loginDto.email, loginDto.password);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload: JwtPayload = { 
            username: user.email, 
            sub: user.id 
        };
        return {
            access_token: this.jwtService.sign(payload),
            user : {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                created_at: user.created_at,
                updated_at: user.updated_at,
            }
        };
    }

    async register(userDto: RegisterUserDto) {

        const existingUser = await this.usersService.getUserByEmail(userDto.email);
        if (existingUser) {
            throw new ConflictException('User already exists');
        }

        try {
            const hashedPassword = await bcrypt.hash(userDto.password, 10);

            const userData: Prisma.UserCreateInput = {
                first_name: userDto.first_name,
                last_name: userDto.last_name,
                email: userDto.email,
                password: hashedPassword,
                created_at: new Date(),
                updated_at: new Date(),
            };

            const newUser = await this.usersService.createUser(userData);
            const {password, ...result} = newUser;
            return result;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async logout(user: any) {
        return user;
    }

    async getSpotifyAuthUrl(): Promise<string> {
        const params = new URLSearchParams({
            client_id: spotifyConfig.clientId,
            response_type: 'code',
            scope: spotifyConfig.scopes.join(' '),
            redirect_uri: spotifyConfig.redirectUri,
            state: randomBytes(16).toString('hex'),
        });

        return `https://accounts.spotify.com/authorize?${params.toString()}`;
    }

    async loginSpotifyUser(accessToken: string) {
        const spotifyUserProfile = await this.getSpotifyUserProfile(accessToken);
        const provider = await this.oauthService.create_or_update_oauth_provider();

        let user = await this.usersService.getUserByEmail(spotifyUserProfile.email);
        if (!user) {
            const userData: Prisma.UserCreateInput = {
                first_name: spotifyUserProfile.display_name.split(' ')[0],
                last_name: spotifyUserProfile.display_name.split(' ').slice(1).join(' '),
                email: spotifyUserProfile.email,
                password: '', // No password as it's an OAuth user
                provider_id:provider.id,
                created_at: new Date(),
                updated_at: new Date(),
            };

            user = await this.usersService.createUser(userData);
        }

        const payload: JwtPayload = { 
            username: user.email, 
            sub: user.id 
        };

        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                created_at: user.created_at,
                updated_at: user.updated_at,
            }
        };
    }

    async registerSpotifyUser(accessToken: string) {
        const spotifyUserProfile = await this.getSpotifyUserProfile(accessToken);

        const existingUser = await this.usersService.getUserByEmail(spotifyUserProfile.email);
        if (existingUser) {
            throw new ConflictException('User already exists');
        }

        const provider = await this.oauthService.create_or_update_oauth_provider();

        const userData: Prisma.UserCreateInput = {
            first_name: spotifyUserProfile.display_name.split(' ')[0],
            last_name: spotifyUserProfile.display_name.split(' ').slice(1).join(' '),
            email: spotifyUserProfile.email,
            password: '', // No password as it's an OAuth user
            provider_id: provider.id,
            created_at: new Date(),
            updated_at: new Date(),
        };

        const newUser = await this.usersService.createUser(userData);
        const { password, ...result } = newUser;
        return result;
    }


    async create_or_update_OAuthProvider() {
        try {
            return await this.oauthService.create_or_update_oauth_provider();
        } catch (error) {
            return error
        }
    }

    async getSpotifyUserProfile(access_token: string): Promise<SpotifyUserProfile> {
        const response = await axios.get('https://api.spotify.com/v1/me', {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });

        if (response.status !== 200) {
            throw new UnauthorizedException('Invalid access token');
        }

        return response.data;
    }

    async getSpotifyToken(code: string) {
        const params = new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            redirect_uri: spotifyConfig.redirectUri,
            client_id: spotifyConfig.clientId,
            client_secret: spotifyConfig.clientSecret,
        });

        const response = await axios.post('https://accounts.spotify.com/api/token', params.toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        return response.data;
    }

    updateUserTokens(id: number, accessToken: string, refreshToken: string): { id: number; first_name: string; last_name: string; email: string; password: string; provider_id: number | null; created_at: Date; updated_at: Date; } | PromiseLike<{ id: number; first_name: string; last_name: string; email: string; password: string; provider_id: number | null; created_at: Date; updated_at: Date; }> {
        throw new Error('Method not implemented.');
    }
}