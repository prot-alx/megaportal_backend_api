import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from 'src/interfaces/jwt-payload.interface';
import { Employee } from 'src/modules/employee/employee.entity';
import { EmployeeService } from 'src/modules/employee/employee.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly employeeService: EmployeeService,
    private readonly jwtService: JwtService,
  ) {}

  // Проверка логина и пароля пользователя
  async validateEmployee(
    login: string,
    password: string,
  ): Promise<Employee | null> {
    const employee = await this.employeeService.findByLogin(login);
    if (employee && (await bcrypt.compare(password, employee.password))) {
      if (!employee.is_active) {
        throw new UnauthorizedException('User is not active');
      }
      return employee;
    }
    return null;
  }

  // Создание JWT токена
  async login(employee: Employee): Promise<{ access_token: string }> {
    const payload: JwtPayload = {
      id: employee.id,
      login: employee.login,
      role: employee.role,
      is_active: employee.is_active,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
