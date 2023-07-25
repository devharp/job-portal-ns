import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const allowedRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    console.log('allowed roles @roles.guard :-', allowedRoles);
    if (!allowedRoles) {
      // No roles specified for this route, allow access by default
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authorizationHeader = request.headers.authorization;
    console.log('authorizationHeader @roles.guard :-', authorizationHeader);

    if (!authorizationHeader)
      throw new UnauthorizedException('Authorization header not found');

    const { role } = this.jwtService.verify(authorizationHeader.split(' ')[1]);
    console.log('role @roles.guard :-', role);

    return allowedRoles.includes(role);
  }
}
