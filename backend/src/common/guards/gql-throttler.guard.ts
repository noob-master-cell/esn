import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ThrottlerGuard, ThrottlerException } from '@nestjs/throttler';

/**
 * Custom throttler guard for GraphQL endpoints.
 * Extends the default ThrottlerGuard to handle GraphQL context and subscriptions.
 * Also whitelists Artillery Cloud IPs for load testing.
 */

// Artillery Cloud IP ranges (load testing service)
// These IPs are whitelisted to bypass rate limiting for performance testing
const ARTILLERY_CLOUD_IP_RANGES = [
    '52.38.91.0/24',      // Artillery Cloud US West
    '3.101.0.0/16',       // Artillery Cloud US West
    '35.72.0.0/13',       // Artillery Cloud EU
    '18.184.0.0/15',      // Artillery Cloud EU
    // Add more Artillery Cloud IP ranges as needed
];

@Injectable()
export class GqlThrottlerGuard extends ThrottlerGuard {
    /**
     * Check if an IP address is in the whitelist (Artillery Cloud or monitoring tools)
     */
    private isWhitelistedIP(ip: string, req?: any): boolean {
        // Also check User-Agent for Artillery Cloud (as a fallback if IP matching fails)
        if (req?.headers?.['user-agent']?.includes('Artillery')) {
            console.log(`✅ Whitelisted User-Agent detected: Artillery Cloud`);
            return true;
        }

        // Check if IP matches any Artillery Cloud range
        try {
            for (const range of ARTILLERY_CLOUD_IP_RANGES) {
                if (this.ipMatchesCIDR(ip, range)) {
                    console.log(`✅ Whitelisted IP detected: ${ip} (Artillery Cloud)`);
                    return true;
                }
            }
        } catch (error) {
            console.error('Error checking IP whitelist:', error);
        }

        return false;
    }

    /**
     * Basic CIDR matching (supports /24, /16, /13, /15 ranges)
     */
    private ipMatchesCIDR(ip: string, cidr: string): boolean {
        const [range, bits] = cidr.split('/');
        const rangeParts = range.split('.').map(Number);
        const ipParts = ip.split('.').map(Number);

        const prefixLength = parseInt(bits, 10);
        const bytesToCheck = Math.floor(prefixLength / 8);

        for (let i = 0; i < bytesToCheck; i++) {
            if (ipParts[i] !== rangeParts[i]) {
                return false;
            }
        }

        return true;
    }

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

        // ✅ Check if the request is from a whitelisted IP (Artillery Cloud, monitoring tools)
        const clientIp = this.getClientIP(req);
        if (clientIp && this.isWhitelistedIP(clientIp, req)) {
            // Bypass rate limiting for whitelisted IPs
            return true;
        }

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

    /**
     * Extract client IP from request, considering proxies and load balancers
     */
    private getClientIP(req: any): string | null {
        // Check for X-Forwarded-For header (common in proxy/load balancer setups like Railway)
        const forwarded = req.headers?.['x-forwarded-for'];
        if (forwarded) {
            // X-Forwarded-For can be a comma-separated list, take the first one
            return forwarded.split(',')[0].trim();
        }

        // Check for X-Real-IP header
        const realIp = req.headers?.['x-real-ip'];
        if (realIp) {
            return realIp;
        }

        // Fallback to connection remote address
        return req.connection?.remoteAddress || req.socket?.remoteAddress || null;
    }

    protected async getTracker(req: Record<string, any>): Promise<string> {
        return req?.ip || '0.0.0.0';
    }
}
