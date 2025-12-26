import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get<string>('AT_SECRET')!,
    });
  }

  // Whatever is returned here becomes 'req.user'
  validate(payload: { sub: number; email: string; role: string }) {
    return {
      id: payload.sub, // Map 'sub' to 'id' so @GetUser('id') works
      email: payload.email,
      role: payload.role,
    };
  }
}
