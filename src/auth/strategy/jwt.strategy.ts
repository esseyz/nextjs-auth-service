import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get<string>('JWT_SECRET') || 'fallback_secret', // Use a fallback for development
    });
  }

  // This method runs AFTER the token is verified.
  // Whatever this returns is what gets put into 'req.user'
  async validate(payload: { sub: number; email: string }) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) return null;
    // Exclude 'hash' from the returned user object
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { hash: _unused, ...userWithoutHash } = user;
    return userWithoutHash;
  }
}
