import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ThrottlerGuard, ThrottlerException } from '@nestjs/throttler';

@Injectable()
export class GqlThrottlerGuard extends ThrottlerGuard {
    getRequestResponse(context: ExecutionContext) {
        const gqlCtx = GqlExecutionContext.create(context);
        const ctx = gqlCtx.getContext();

        // Handle both Express (req) and Fastify (request) or other contexts
        // For GraphQL, req is usually in ctx.req
        let req = ctx.req || ctx.request;
        let res = ctx.res || ctx.response;

        // Handle subscriptions where req might be in connection.context
        if (!req && ctx.connection) {
            req = ctx.connection.context;
        }

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
                    get: () => undefined, // Express also uses .get() for headers
                    ip: '0.0.0.0',
                    ips: []
                },
                res: {
                    header: () => { }, // Mock header setter
                    headers: {},
                }
            };
        }

        // Ensure res is defined even if req was found (e.g. in subscriptions)
        if (!res) {
            res = {
                header: () => { },
                headers: {},
            };
        }

        return { req, res };
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const gqlCtx = GqlExecutionContext.create(context);
        const info = gqlCtx.getInfo();

        // Bypass throttling for Subscriptions
        if (info && info.operation && info.operation.operation === 'subscription') {
            return true;
        }

        const { req } = this.getRequestResponse(context);

        // Safety check: if req is missing, or it's our mock, or it lacks headers
        // We check for both 'header' function (Express) and 'headers' object (Fastify/others)
        if (!req ||
            (req.ip === '0.0.0.0' && req.headers && Object.keys(req.headers).length === 0) ||
            (!req.header && !req.headers)) {
            return true;
        }

        try {
            return await super.canActivate(context);
        } catch (error) {
            // If it's a ThrottlerException, rethrow it to enforce the limit
            if (error instanceof ThrottlerException) {
                throw error;
            }

            // If ThrottlerGuard fails for other reasons (e.g. missing req properties), allow the request
            // This is better than crashing the subscription
            // console.warn('GqlThrottlerGuard: Throttling check failed, allowing request', error.message);
            return true;
        }
    }

    protected async getTracker(req: Record<string, any>): Promise<string> {
        return req?.ip || '0.0.0.0';
    }
}
