import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Requests, RequestStatus } from './requests.entity';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Employee } from '../employee/employee.entity';
import { CreateRequestDto } from './request.dto';
import { UserResponseDto } from '../employee/employee.dto';
import { DetailedInternalServerErrorException } from 'src/error/all-exceptions.filter';

@Injectable()
export class RequestsService {
  constructor(
    @InjectRepository(Requests)
    private readonly requestsRepository: Repository<Requests>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    private readonly jwtService: JwtService,
  ) {}

  extractUserIdFromToken(token: string): number {
    try {
      const decodedToken = this.jwtService.decode(token);
      if (!decodedToken?.id) {
        throw new UnauthorizedException('Invalid or missing token');
      }
      return decodedToken.id;
    } catch (error) {
      throw new DetailedInternalServerErrorException(
        'Error decoding token',
        error.message,
      );
    }
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
    try {
      // Получаем ID текущего пользователя из токена
      const employeeId = this.extractUserIdFromToken(token);

      // Находим сотрудника по ID
      const employee = await this.employeeRepository.findOne({
        where: { id: employeeId },
      });

      if (!employee) {
        throw new NotFoundException('Employee not found');
      }

      // Проверяем, есть ли активные заявки для этого клиента
      const existingRequest = await this.requestsRepository.findOne({
        where: {
          client_id: createRequestDto.client_id,
          status: Not(RequestStatus.CLOSED), // Проверяем статус, отличный от 'CLOSED'
        },
      });

      if (existingRequest) {
        throw new BadRequestException(
          `An active request for this client already exists with status: ${existingRequest.status}. You cannot create a new request until the previous one is closed.`,
        );
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
        // status: createRequestDto.status || RequestStatus.NEW,
      });

      // Сохраняем заявку в базе данных
      return await this.requestsRepository.save(request);
    } catch (error) {
      throw new DetailedInternalServerErrorException(
        'Error creating request',
        error.message,
      );
    }
  }

  async findById(id: number): Promise<Requests> {
    try {
      const request = await this.requestsRepository.findOne({
        where: { id },
      });

      if (!request) {
        throw new NotFoundException('Request not found');
      }

      return request;
    } catch (error) {
      throw new DetailedInternalServerErrorException(
        'Error retrieving request',
        error.message,
      );
    }
  }

  async getCurrentUser(token: string): Promise<UserResponseDto> {
    try {
      const employeeId = this.extractUserIdFromToken(token);

      const employee = await this.employeeRepository.findOne({
        where: { id: employeeId },
      });

      if (!employee) {
        throw new NotFoundException('User not found');
      }

      // Формируем ответ на основе DTO
      return this.transformEmployeeToDto(employee);
    } catch (error) {
      throw new DetailedInternalServerErrorException(
        'Error retrieving current user',
        error.message,
      );
    }
  }

  async findAll(): Promise<any[]> {
    try {
      const requests = await this.requestsRepository.find({
        relations: ['hr_id'],
      });
      return requests.map((request) => ({
        ...request,
        hr_id: this.transformEmployeeToDto(request.hr_id), // Преобразование `hr_id` в DTO
      }));
    } catch (error) {
      throw new DetailedInternalServerErrorException(
        'Error retrieving requests',
        error.message,
      );
    }
  }
}
