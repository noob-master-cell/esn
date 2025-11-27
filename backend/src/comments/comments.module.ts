import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsResolver } from './comments.resolver';
import { PrismaModule } from '../prisma/prisma.module';
import { PubSubModule } from '../common/pubsub.module';

@Module({
  imports: [PrismaModule, PubSubModule],
  providers: [CommentsResolver, CommentsService],
})
export class CommentsModule { }
