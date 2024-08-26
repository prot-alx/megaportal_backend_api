import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  ConflictException,
  Get,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateEmployeeDto } from 'src/modules/employee/employee.dto';
import { EmployeeService } from 'src/modules/employee/employee.service';
import { LoginDto } from './dto/login.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtPayload } from 'src/interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { DetailedInternalServerErrorException } from 'src/error/all-exceptions.filter';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly employeeService: EmployeeService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // Эндпоинт для логина пользователя
  @Post('login')
  @ApiOperation({
    summary: 'Login // Логинизация. Вводим логин пароль, всё.',
  })
  async login(@Body() loginDto: LoginDto) {
    try {
      const employee = await this.authService.validateEmployee(
        loginDto.login,
        loginDto.password,
      );
      if (!employee) {
        throw new UnauthorizedException('Неверный логин или пароль.');
      }
      return this.authService.login(employee);
    } catch (error) {
      throw new DetailedInternalServerErrorException(
        'Ошибка данных.',
        error.message,
      );
    }
  }

  // Эндпоинт для регистрации нового пользователя
  @Post('register')
  @ApiOperation({
    summary:
      'Register // Регистрация. Нужна для создания новых сотрудников. В дальнейшем ограничить только для админа, чтобы никто не создавал учетки извне.',
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

  // Эндпоинт для проверки существования токена
  @Get('checkauth')
  @ApiOperation({
    summary:
      'Check Token // Проверка валидности токена. Если токен валидный, возвращает информацию о пользователе.',
  })
  async checkToken(@Req() req: Request) {
    const user = await this.authService.checkAuth(req);
    return { message: 'Token is valid', user };
  }

  @Post('refresh')
  @ApiOperation({
    summary: 'Refresh Token // Обновление токенов по refresh token.',
  })
  async refreshToken(@Body() refreshTokenDto: { refresh_token: string }) {
    const { refresh_token } = refreshTokenDto;
    try {
      console.log('Received refresh token:', refresh_token); // Логирование полученного токена
      const payload = this.jwtService.verify<JwtPayload>(refresh_token, {
        secret: this.configService.get<string>('REFRESH_JWT'),
      });
      console.log('Payload from refresh token:', payload); // Логирование полезной нагрузки

      const employee = await this.employeeService.findOne(payload.id);
      if (!employee?.is_active) {
        throw new UnauthorizedException('Invalid or inactive user');
      }

      return this.authService.login(employee);
    } catch (error) {
      console.error('Error verifying refresh token:', error); // Логирование ошибки
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
