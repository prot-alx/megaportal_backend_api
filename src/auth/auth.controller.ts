import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  ConflictException,
  Get,
  Req,
  Res,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { CreateEmployeeDto } from 'src/modules/employee/employee.dto';
import { EmployeeService } from 'src/modules/employee/employee.service';
import { LoginDto } from './dto/login.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { DetailedInternalServerErrorException } from 'src/error/all-exceptions.filter';
import { AppConfigService } from 'src/config/config.service';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly employeeService: EmployeeService,
    private readonly jwtService: JwtService,
    private readonly configService: AppConfigService, // Используем AppConfigService
  ) {}

  // Эндпоинт для логина пользователя
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      const employee = await this.authService.validateEmployee(
        loginDto.login,
        loginDto.password,
      );
      if (!employee) {
        throw new UnauthorizedException('Неверный логин или пароль.');
      }
      const tokens = await this.authService.login(employee);

      // Устанавливаем cookies
      response.cookie('access_token', tokens.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000, // 15 минут
      });

      response.cookie('refresh_token', tokens.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
      });

      return employee;
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

  // Эндпоинт для проверки существования access токена
  @Get('checkauth')
  @ApiOperation({
    summary:
      'Check Token // Проверка валидности токена. Если токен валидный, возвращает информацию о пользователе.',
  })
  async checkToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.checkAuth(req, res);
    return { user };
  }

  // Эндпоинт для обновления токена
  @Post('refresh')
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      await this.authService.refreshToken(req, res);
      return { message: 'Tokens refreshed successfully' };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout user' })
  async logout(@Res({ passthrough: true }) response: Response) {
    // Очищаем cookies
    response.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });

    response.clearCookie('refresh_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });

    return { message: 'Logged out successfully' };
  }
}
