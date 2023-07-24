import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'your_secret_key_here', // Replace with your actual secret key
    });
  }

  async validate(payload: any) {
    if (!payload || !payload?.id)
      throw new UnauthorizedException('Invalid token');

    // Validate token and handle token expiration error
    try {
      const { role } = await this.authService.getUserById(payload.id);
      return { role };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
