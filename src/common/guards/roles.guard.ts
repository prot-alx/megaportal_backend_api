import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { EmployeeRole } from 'src/modules/employee/employee.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<EmployeeRole[]>(
      'roles',
      context.getHandler(),
    );
    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = request.cookies['access_token'];
    if (!token) {
      return false;
    }

    try {
      const payload = this.jwtService.verify(token);
      if (!payload.is_active) {
        return false;
      }

      const userRole = payload.role as EmployeeRole;
      return roles.includes(userRole);
    } catch {
      return false;
    }
  }
}
