import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Added / and fixed path
import { AuthDto } from './dto';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client'; // Use this instead of runtime/library

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signup(dto: AuthDto) {
    const hash = await bcrypt.hash(dto.password, 10);

    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });

      // Casting to any or removing manually to hide the hash
      const { hash: _, ...result } = user;
      return result;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Email already exists');
        }
      }
      throw error;
    }
  }

  async signin(dto: AuthDto) {
    // 1. Find user by email
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    // 2. If user doesn't exist throw exception
    if (!user) {
      throw new ForbiddenException('Credentials incorrect');
    }

    // 3. Compare password
    const pwMatches = await bcrypt.compare(dto.password, user.hash);

    // 4. If password incorrect throw exception
    if (!pwMatches) {
      throw new ForbiddenException('Credentials incorrect');
    }

    // 5. Return user (excluding hash)
    const { hash: _, ...result } = user;
    return result;
  }
}
