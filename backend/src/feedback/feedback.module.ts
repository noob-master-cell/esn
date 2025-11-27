import { Module } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { FeedbackResolver } from './feedback.resolver';
import { PrismaModule } from '../prisma/prisma.module';
import { PubSubModule } from '../common/pubsub.module';

@Module({
    imports: [PrismaModule, PubSubModule],
    providers: [FeedbackResolver, FeedbackService],
    exports: [FeedbackService],
})
export class FeedbackModule { }
