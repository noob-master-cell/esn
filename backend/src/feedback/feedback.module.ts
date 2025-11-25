import { Module } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { FeedbackResolver } from './feedback.resolver';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    providers: [FeedbackResolver, FeedbackService],
    exports: [FeedbackService],
})
export class FeedbackModule { }
