import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { PrismaService } from '../../../prisma/prisma.service';
import { UserTransformer } from '../../common/transformers/user.transformer';
import * as jwt from 'jsonwebtoken';
import { JwksClient } from 'jwks-rsa';
import axios from 'axios';

@Injectable()
export class Auth0Guard implements CanActivate {
    private jwksClient: JwksClient;

    constructor(private prismaService: PrismaService) {
        const auth0Domain = process.env.AUTH0_DOMAIN;

        if (!auth0Domain) {
            throw new Error('AUTH0_DOMAIN environment variable is not set');
        }

        // Initialize JWKS client to get Auth0 public keys
        this.jwksClient = new JwksClient({
            jwksUri: `https://${auth0Domain}/.well-known/jwks.json`,
            cache: true,
            rateLimit: true,
        });
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            console.log('🔍 Auth0 Guard: Starting validation');

            // Get the request object (works for both HTTP and GraphQL)
            const ctx = GqlExecutionContext.create(context);
            const req = ctx.getContext().req;

            // Extract token from Authorization header
            const authHeader = req.headers?.authorization;
            console.log('🔍 Auth0 Guard: Auth header present:', !!authHeader);

            if (!authHeader) {
                console.log('❌ Auth0 Guard: No authorization header');
                throw new UnauthorizedException('No authorization header');
            }

            const token = authHeader.replace('Bearer ', '');
            console.log('🔍 Auth0 Guard: Token extracted, length:', token.length);

            if (!token) {
                console.log('❌ Auth0 Guard: No token in header');
                throw new UnauthorizedException('No token provided');
            }

            // Verify and decode the JWT token
            console.log('🔍 Auth0 Guard: Verifying with Auth0...');
            const decoded = await this.verifyToken(token);
            console.log('✅ Auth0 Guard: Token verified, user ID:', decoded.sub);

            // Extract user information from Auth0 token
            const auth0UserId = decoded.sub; // Usually in format "auth0|xxxxx"

            // Try multiple possible locations for email claim
            const audience = process.env.AUTH0_AUDIENCE;
            let email = decoded.email || decoded[`${audience}/email`] || decoded.name;

            const role = decoded[`${audience}/role`] || 'USER';

            console.log('🔍 Auth0 Guard: Decoded token:', JSON.stringify(decoded, null, 2));
            console.log('🔍 Auth0 Guard: Extracted email:', email);
            console.log('🔍 Auth0 Guard: Extracted role:', role);

            // Sync user to database
            console.log('🔄 Auth0 Guard: Syncing user to database...');
            const dbUser = await this.syncUserToDatabase(auth0UserId, email, role, token);

            if (!dbUser || !dbUser.isActive) {
                console.log('❌ Auth0 Guard: User not found or inactive');
                throw new UnauthorizedException('User not found or inactive');
            }

            // Transform user and attach to request
            const user = UserTransformer.fromPrisma(dbUser);
            req.user = user;

            console.log('✅ Auth0 Guard: Authentication successful:', user.email);
            return true;
        } catch (error) {
            console.log('❌ Auth0 Guard failed:', error.message);
            throw new UnauthorizedException(
                `Authentication failed: ${error.message}`,
            );
        }
    }

    private async verifyToken(token: string): Promise<any> {
        return new Promise((resolve, reject) => {
            // Decode the token header to get the kid
            const decodedToken = jwt.decode(token, { complete: true });

            if (!decodedToken || !decodedToken.header.kid) {
                console.error('❌ Auth0 Guard: Invalid token structure or missing kid');
                return reject(new Error('Invalid token structure'));
            }

            console.log('🔍 Auth0 Guard: Token decoded, kid:', decodedToken.header.kid);

            // Get the signing key from Auth0
            this.jwksClient.getSigningKey(decodedToken.header.kid, (err, key) => {
                if (err) {
                    console.error('❌ Auth0 Guard: Error getting signing key:', err.message);
                    return reject(err);
                }

                const signingKey = key.getPublicKey();

                // Verify the token
                jwt.verify(
                    token,
                    signingKey,
                    {
                        audience: process.env.AUTH0_AUDIENCE,
                        issuer: `https://${process.env.AUTH0_DOMAIN}/`,
                        algorithms: ['RS256'],
                    },
                    (err, decoded) => {
                        if (err) {
                            console.error('❌ Auth0 Guard: Token verification failed:', err.message);
                            return reject(err);
                        }
                        resolve(decoded);
                    },
                );
            });
        });
    }

    private async syncUserToDatabase(
        auth0UserId: string,
        email: string | undefined,
        role: string,
        token: string,
    ) {
        // 1. Try to find user by Auth0 ID
        let user = await this.prismaService.user.findUnique({
            where: { auth0Id: auth0UserId },
        });

        // 2. If not found by Auth0 ID, try by Email (if we have it)
        if (!user && email) {
            user = await this.prismaService.user.findUnique({
                where: { email: email },
            });
        }

        // 3. If still not found, and we don't have an email, we MUST fetch it from Auth0
        if (!user && !email) {
            console.log('⚠️ Email missing in token. Fetching from Auth0 /userinfo...');
            try {
                const userInfo = await this.getUserInfo(token);
                email = userInfo.email;
                console.log('✅ Fetched email from Auth0:', email);
            } catch (error) {
                console.error('❌ Failed to fetch user info from Auth0:', error.message);
                throw new UnauthorizedException('Could not retrieve email from Auth0');
            }
        }

        if (!email) {
            throw new UnauthorizedException('Email is required to create a user');
        }

        if (!user) {
            // Create new user, but handle possible duplicate email
            console.log('📝 Creating new user from Auth0:', email);
            try {
                user = await this.prismaService.user.create({
                    data: {
                        auth0Id: auth0UserId,
                        email: email,
                        role: role as any,
                        isActive: true,
                    },
                });
            } catch (e) {
                // Prisma unique constraint violation (P2002) – email already exists
                if (e?.code === 'P2002') {
                    console.warn('⚠️ Duplicate email detected, fetching existing user');
                    // Fetch the existing user by email and update auth0Id and role
                    user = await this.prismaService.user.update({
                        where: { email: email },
                        data: { auth0Id: auth0UserId, role: role as any },
                    });
                } else {
                    throw e;
                }
            }
        } else {
            // User exists and has Auth0 ID
            // Check if role needs to be updated
            if (user.role !== role) {
                console.log(`🔄 Updating user role from ${user.role} to ${role}`);
                user = await this.prismaService.user.update({
                    where: { id: user.id },
                    data: { role: role as any },
                });
            }
        }

        return user;
    }

    private async getUserInfo(token: string): Promise<any> {
        const auth0Domain = process.env.AUTH0_DOMAIN;
        const url = `https://${auth0Domain}/userinfo`;

        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    }
}
