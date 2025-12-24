import { Controller, Get, UseGuards } from '@nestjs/common';
import * as PrismaModel from '@prisma/client';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { JwtGuard } from '../auth/guard/jwt.guard'; // We'll create this in a second

@Controller('users')
export class UserController {
  @UseGuards(JwtGuard) // Using a named guard instead of AuthGuard('jwt')
  @Get('me')
  getMe(@GetUser() user: PrismaModel.User) {
    return user;
  }
}
