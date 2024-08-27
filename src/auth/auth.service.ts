import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from 'src/interfaces/jwt-payload.interface';
import { Employee } from 'src/modules/employee/employee.entity';
import { EmployeeService } from 'src/modules/employee/employee.service';
import { Request } from 'express';
import { AppConfigService } from 'src/config/config.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly employeeService: EmployeeService,
    private readonly jwtService: JwtService,
    private readonly configService: AppConfigService,
  ) {}

  async validateEmployee(
    login: string,
    password: string,
  ): Promise<Employee | null> {
    const employee = await this.employeeService.findByLogin(login);

    if (employee && (await bcrypt.compare(password, employee.password))) {
      if (!employee.is_active) {
        throw new UnauthorizedException('Данная учетная запись отключена.');
      }
      return employee;
    }

    return null;
  }

  async login(
    employee: Employee,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const payload: JwtPayload = {
      id: employee.id,
      login: employee.login,
      role: employee.role,
      is_active: employee.is_active,
      name: employee.name,
    };

    return {
      access_token: this.jwtService.sign(payload, {
        secret: this.configService.SECRET_JWT,
        expiresIn: this.configService.EXPIRE_JWT,
      }),
      refresh_token: this.jwtService.sign(payload, {
        secret: this.configService.REFRESH_JWT,
        expiresIn: this.configService.REFRESH_EXPIRE_JWT,
      }),
    };
  }

  async checkAuth(req: Request) {
    const access_token = req.headers['authorization']?.split(' ')[1];

    if (!access_token) {
      throw new UnauthorizedException('Token not provided');
    }

    try {
      const payload = this.jwtService.verify<JwtPayload>(access_token);
      const user = await this.employeeService.findOne(payload.id);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      if (!user.is_active) {
        throw new UnauthorizedException('Данная учетная запись отключена.');
      }
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async refreshToken(refreshToken: string): Promise<{ access_token: string }> {
    try {
      const payload = this.jwtService.verify<JwtPayload>(refreshToken, {
        secret: this.configService.REFRESH_JWT,
      });

      const employee = await this.employeeService.findOne(payload.id);
      if (!employee?.is_active) {
        throw new UnauthorizedException('Invalid or inactive user');
      }

      const newPayload: JwtPayload = {
        id: employee.id,
        login: employee.login,
        role: employee.role,
        is_active: employee.is_active,
        name: employee.name,
      };

      return { access_token: this.jwtService.sign(newPayload) };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
