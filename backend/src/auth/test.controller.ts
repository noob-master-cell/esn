import { Controller, Get, UseGuards, Req, Headers } from '@nestjs/common';
import { Auth0JwtGuard } from './guards/auth0-jwt.guard';

@Controller('test')
export class TestController {
  @Get('headers')
  testHeaders(@Headers() headers: any, @Req() req: any) {
    return {
      message: 'Headers test',
      hasAuth: !!headers.authorization,
      authHeader: headers.authorization?.substring(0, 50) + '...',
      allHeaders: Object.keys(headers),
    };
  }

  @Get('auth')
  @UseGuards(Auth0JwtGuard)
  testAuth(@Req() req: any) {
    return {
      message: 'Auth test successful!',
      user: req.user
        ? {
            id: req.user.id,
            email: req.user.email,
            firstName: req.user.firstName,
          }
        : null,
    };
  }
}
