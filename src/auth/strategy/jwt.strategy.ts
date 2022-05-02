import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthDoc } from '../auth.schema';
import { JWTService } from '../service/jwt.service';
const config = require('../../config/index');
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  @Inject(JWTService)
  private readonly jwtService: JWTService;

  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.JWT_CONFIG.secret,
      ignoreExpiration: true,
    });
  }

  private validateToken(token: string): Promise<AuthDoc> {
    return this.jwtService.validateUser(token);
  }
}
