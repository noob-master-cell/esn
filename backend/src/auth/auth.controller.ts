import { Controller } from '@nestjs/common';
import { ClerkService } from '../clerk/clerk.service';

@Controller('auth')
export class AuthController {
  constructor(private clerkService: ClerkService) {}
}
