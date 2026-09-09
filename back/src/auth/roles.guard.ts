import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { RoleEnum } from 'prisma/generated/prisma/client';

export interface JwtPayload {
  id: number;
  email: string;
  role: RoleEnum;
}

export interface RequestWithUser extends Request {
  user: JwtPayload;
}
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    //récupérer roles depuis decorator @Roles
    const requiredRoles = this.reflector.getAllAndOverride<RoleEnum[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    //si aucun role requis -> autoriser
    if (!requiredRoles) {
      return true;
    }
    // récupérer user depuis request
    const request: RequestWithUser = context.switchToHttp().getRequest();
    const user: JwtPayload = request.user;

    if (!user) {
      throw new ForbiddenException('User not found in request');
    }
    //vérifier role
    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}
