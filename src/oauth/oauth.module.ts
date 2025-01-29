import { Module } from '@nestjs/common';
import { OauthService } from './oauth.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [OauthService, PrismaService],
  exports: [OauthService],
})
export class OauthModule {}
