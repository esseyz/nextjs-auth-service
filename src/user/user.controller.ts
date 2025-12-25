import { Controller, Get, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { GetUser, Roles } from '../common/decorators';
import { AtGuard, RolesGuard } from '../common/guards';
import * as PrismaModel from '@prisma/client';

@UseGuards(AtGuard) // Every route here now requires a valid Access Token
@Controller('users')
export class UserController {
  @Get('me')
  getMe(@GetUser() user: PrismaModel.User) {
    return user;
  }

  // RBAC TEST ROUTE
  @Roles(Role.ADMIN) // Attach metadata: Only ADMINs allowed
  @UseGuards(RolesGuard) // Run the guard to check the metadata against the user's JWT
  @Get('admin-only')
  adminRoute() {
    return {
      message: 'Access granted: You have verified the ADMIN role.',
    };
  }
}
