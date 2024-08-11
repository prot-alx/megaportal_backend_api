import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateEmployeeDto } from 'src/modules/employee/employee.dto';
import { EmployeeService } from 'src/modules/employee/employee.service';
import { LoginDto } from './dto/login.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly employeeService: EmployeeService,
  ) {}

  // Эндпоинт для логина пользователя
  @Post('login')
  @ApiOperation({
    summary: 'Login // Логинизация. Вводим логин пароль, всё.',
  })
  async login(@Body() loginDto: LoginDto) {
    const employee = await this.authService.validateEmployee(
      loginDto.login,
      loginDto.password,
    );
    if (!employee) {
      throw new UnauthorizedException();
    }
    return this.authService.login(employee);
  }

  // Эндпоинт для регистрации нового пользователя
  @Post('register')
  @ApiOperation({
    summary: 'Register // Регистрация. Нужна для создания новых сотрудников. В дальнейшейм ограничить только для админа, чтобы никто не создавал учетки извне.',
  })
  async register(@Body() createEmployeeDto: CreateEmployeeDto) {
    try {
      const employee = await this.employeeService.create(createEmployeeDto);
      return { message: 'User registered successfully', employee };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException('User with this login already exists');
      }
      throw error;
    }
  }
}
