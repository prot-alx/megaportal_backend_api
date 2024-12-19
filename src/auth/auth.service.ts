import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from 'src/interfaces/jwt-payload.interface';
import { Employee } from 'src/modules/employee/employee.entity';
import { EmployeeService } from 'src/modules/employee/employee.service';
import { Request, Response } from 'express';
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

  async checkAuth(req: Request, res: Response) {
    const access_token = req.cookies['access_token'];
    const refresh_token = req.cookies['refresh_token'];

    if (!access_token && refresh_token) {
      try {
        const payload = this.jwtService.verify<JwtPayload>(refresh_token, {
          secret: this.configService.REFRESH_JWT,
        });

        const employee = await this.employeeService.findOne(payload.id);
        if (!employee?.is_active) {
          throw new UnauthorizedException('Invalid or inactive user');
        }

        // Создаем новые токены с правильным временем жизни
        const newAccessToken = this.jwtService.sign(payload, {
          secret: this.configService.SECRET_JWT,
          expiresIn: this.configService.EXPIRE_JWT,
        });

        res.cookie('access_token', newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: this.configService.EXPIRE_JWT * 1000, // конвертируем секунды в миллисекунды
        });

        return employee;
      } catch (error) {
        throw new UnauthorizedException('Invalid refresh token');
      }
    }

    if (!access_token) {
      throw new UnauthorizedException('Token not provided');
    }

    try {
      const payload = this.jwtService.verify<JwtPayload>(access_token, {
        secret: this.configService.SECRET_JWT, // добавляем secret
      });
      const user = await this.employeeService.findOne(payload.id);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      if (!user.is_active) {
        throw new UnauthorizedException('Данная учетная запись отключена.');
      }

      return user;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async refreshToken(req: Request, res: Response): Promise<{ user: any }> {
    const refresh_token = req.cookies['refresh_token'];
    if (!refresh_token) {
      throw new UnauthorizedException('Refresh token not provided');
    }

    try {
      const payload = this.jwtService.verify<JwtPayload>(refresh_token, {
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

      // Генерируем новые токены с правильными параметрами
      const newAccessToken = this.jwtService.sign(newPayload, {
        secret: this.configService.SECRET_JWT,
        expiresIn: this.configService.EXPIRE_JWT,
      });

      const newRefreshToken = this.jwtService.sign(newPayload, {
        secret: this.configService.REFRESH_JWT,
        expiresIn: this.configService.REFRESH_EXPIRE_JWT,
      });

      // Устанавливаем cookies с согласованным временем жизни
      res.cookie('access_token', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: this.configService.EXPIRE_JWT * 1000,
      });

      res.cookie('refresh_token', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: this.configService.REFRESH_EXPIRE_JWT * 1000,
      });

      return { user: employee };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
