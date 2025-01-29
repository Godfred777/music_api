import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, OauthProvider } from '@prisma/client';

@Injectable()
export class OauthService {
    constructor(private prisma: PrismaService) {}

    async create_or_update_oauth_provider() {
        const oauth_provider = await this.prisma.oauthProvider.upsert({
            where: { name: 'spotify' },
            update: {
                client_id: 'your_client_id', // replace with actual client_id
                client_secret: '',
                redirect_uri: '',
                auth_url: '',
                token_url: '',
                created_at: new Date(),
            },
            create: {
                name: 'spotify',
                client_id: 'your_client_id', // replace with actual client_id
                client_secret: 'your_client_secret', // replace with actual client_secret
                redirect_uri: 'your_redirect_uri', // replace with actual redirect_uri
                auth_url: 'your_auth_url', // replace with actual auth_url
                token_url: 'your_token_url', // replace with actual token_url
                created_at: new Date(), // replace with actual created_at
            },
        });
        return oauth_provider;
    }
}
