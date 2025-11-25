import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class GqlThrottlerGuard extends ThrottlerGuard {
    getRequestResponse(context: ExecutionContext) {
        const gqlCtx = GqlExecutionContext.create(context);
        const ctx = gqlCtx.getContext();
        // Handle both Express (req) and Fastify (request) or other contexts
        const req = ctx.req || ctx.request;
        const res = ctx.res || ctx.response;

        if (!req) {
            // If no request object (e.g. internal context), return empty object to avoid crash
            // Throttler might fail to get IP, but won't crash the app
            return { req: { headers: {} }, res: {} };
        }

        return { req, res };
    }
}
