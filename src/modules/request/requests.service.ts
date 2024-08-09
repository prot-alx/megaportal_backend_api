import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Requests, RequestStatus } from './requests.entity';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from '../employee/employee.entity';
import { CreateRequestDto } from './request.dto';
import { UserResponseDto } from '../employee/employee.dto';

@Injectable()
export class RequestsService {
  constructor(
    @InjectRepository(Requests)
    private readonly requestsRepository: Repository<Requests>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    private readonly jwtService: JwtService, // Make sure JwtService is injected
  ) {}

  extractUserIdFromToken(token: string): number {
    const decodedToken = this.jwtService.decode(token);
    if (!decodedToken?.id) {
      throw new UnauthorizedException('Invalid or missing token');
    }
    return decodedToken.id;
  }

  private transformEmployeeToDto(employee: Employee): UserResponseDto {
    return {
      id: employee.id,
      name: employee.name,
    };
  }

  async create(
    createRequestDto: CreateRequestDto,
    token: string,
  ): Promise<Requests> {
    // Получаем ID текущего пользователя из токена
    const employeeId = this.extractUserIdFromToken(token);

    // Находим сотрудника по ID
    const employee = await this.employeeRepository.findOne({
      where: { id: employeeId },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    // Преобразуем строку в дату
    const requestDate = new Date(createRequestDto.request_date);
    if (isNaN(requestDate.getTime())) {
      throw new BadRequestException('Invalid request_date format');
    }

    // Создаем заявку
    const request = this.requestsRepository.create({
      ...createRequestDto,
      hr_id: employee,
      request_date: requestDate,
      status: createRequestDto.status || RequestStatus.NEW,
    });

    // Сохраняем заявку в базе данных
    return this.requestsRepository.save(request);
  }

  async findById(id: number): Promise<Requests> {
    const request = await this.requestsRepository.findOne({
      where: { id },
    });

    if (!request) {
      throw new NotFoundException('Request not found');
    }

    return request;
  }

  async getCurrentUser(token: string): Promise<UserResponseDto> {
    const employeeId = this.extractUserIdFromToken(token);

    const employee = await this.employeeRepository.findOne({
      where: { id: employeeId },
    });

    if (!employee) {
      throw new NotFoundException('User not found');
    }

    // Формируем ответ на основе DTO
    return {
      id: employee.id,
      name: employee.name,
    };
  }

  async findAll(): Promise<any[]> {
    const requests = await this.requestsRepository.find({
      relations: ['hr_id'],
    });
    return requests.map((request) => ({
      ...request,
      hr_id: this.transformEmployeeToDto(request.hr_id), // Преобразование `hr_id` в DTO
    }));
  }
}
