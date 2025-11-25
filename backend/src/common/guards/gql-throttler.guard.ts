import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class GqlThrottlerGuard extends ThrottlerGuard {
    getRequestResponse(context: ExecutionContext) {
        const gqlCtx = GqlExecutionContext.create(context);
        const ctx = gqlCtx.getContext();

        // Handle both Express (req) and Fastify (request) or other contexts
        // For GraphQL, req is usually in ctx.req
        let req = ctx.req || ctx.request;
        let res = ctx.res || ctx.response;

        // If still undefined, try switching to HTTP (for REST requests using this guard)
        if (!req) {
            const http = context.switchToHttp();
            req = http.getRequest();
            res = http.getResponse();
        }

        if (!req) {
            // If absolutely no request object found, return a safe mock
            // ThrottlerGuard might access req.header (function) or req.headers (object)
            return {
                req: {
                    headers: {},
                    header: () => undefined, // Mock Express header function
                    ip: '0.0.0.0',
                    ips: []
                },
                res: {}
            };
        }

        return { req, res };
    }
}
