import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { UserController } from './user/user.controller';
import { BookmarkModule } from './bookmark/bookmark.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      expandVariables: true,
    }), // Important for JWT secrets
    AuthModule,
    PrismaModule,
    BookmarkModule,
  ],
  controllers: [UserController],
})
export class AppModule {}
