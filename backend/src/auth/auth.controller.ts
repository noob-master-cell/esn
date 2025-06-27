import { Controller, Get, Headers, Post, Body } from '@nestjs/common';
import { ClerkService } from '../clerk/clerk.service';

@Controller('auth')
export class AuthController {
  constructor(private clerkService: ClerkService) {}

  @Get('test')
  testEndpoint() {
    return { message: 'Auth controller is working!' };
  }

  @Post('verify-token')
  async verifyToken(@Body() body: { token: string }) {
    try {
      console.log('🔍 Test endpoint: Verifying token...');
      const result = await this.clerkService.verifyToken(body.token);
      return {
        success: true,
        userId: result.sub,
        message: 'Token verified successfully',
      };
    } catch (error) {
      console.error(
        '❌ Test endpoint: Token verification failed:',
        error.message,
      );
      return {
        success: false,
        error: error.message,
      };
    }
  }

  @Get('debug')
  async debugClerk(@Headers('authorization') authHeader: string) {
    try {
      console.log('🔍 Debug endpoint called');
      console.log('🔍 Auth header:', authHeader);

      if (!authHeader) {
        return { error: 'No authorization header' };
      }

      const token = authHeader.replace('Bearer ', '');
      console.log('🔍 Extracted token:', token.substring(0, 20) + '...');

      const result = await this.clerkService.verifyToken(token);
      console.log('✅ Token verified:', result.sub);

      return {
        success: true,
        userId: result.sub,
        tokenPreview: token.substring(0, 20) + '...',
      };
    } catch (error) {
      console.error('❌ Debug endpoint error:', error);
      return {
        success: false,
        error: error.message,
        fullError: error.toString(),
      };
    }
  }
}
