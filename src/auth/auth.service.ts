import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: AuthDto) {
    // Generate the password hash
    const hash = await bcrypt.hash(dto.password, 10);

    try {
      // Save the new user in the db
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });

      // Return the token instead of the user object
      return this.signToken(user.id, user.email);
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
    // 1. Find the user by email
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    // 2. If user does not exist throw exception
    if (!user) {
      throw new ForbiddenException('Credentials incorrect');
    }

    // 3. Compare password
    const pwMatches = await bcrypt.compare(dto.password, user.hash);

    // 4. If password incorrect throw exception
    if (!pwMatches) {
      throw new ForbiddenException('Credentials incorrect');
    }

    // 5. Send back the token
    return this.signToken(user.id, user.email);
  }

  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };

    const secret = this.config.get<string>('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: secret,
    });

    return {
      access_token: token,
    };
  }
}
