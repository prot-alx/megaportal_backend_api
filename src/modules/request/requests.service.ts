import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Requests, RequestStatus, RequestType } from './requests.entity';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Employee } from '../employee/employee.entity';
import {
  CreateRequestDto,
  RequestResponseDto,
  RequestUpdate,
  UpdateRequestDateDto,
  UpdateRequestTypeDto,
} from './request.dto';
import { EmployeeDto } from '../employee/employee.dto';
import { DetailedInternalServerErrorException } from 'src/error/all-exceptions.filter';

export interface FindFilteredParams {
  status?: RequestStatus;
  type?: RequestType[];
  requestDateStart?: Date;
  requestDateEnd?: Date;
  updatedAtStart?: Date;
  updatedAtEnd?: Date;
  page?: number;
  limit?: number;
}

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

  private transformEmployeeToDto(employee: Employee): EmployeeDto {
    return {
      id: employee.id,
      name: employee.name,
      role: employee.role,
      is_active: employee.is_active,
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
        throw new NotFoundException('Сотрудник не найден.');
      }

      // Проверяем, есть ли активные заявки для этого клиента
      const existingRequest = await this.requestsRepository.findOne({
        where: {
          client_id: createRequestDto.client_id,
          status: Not(RequestStatus.CLOSED),
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
        created_at: new Date(),
        updated_at: new Date(),
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

  async getRequestById(id: number): Promise<Requests> {
    try {
      // Ищем заявку по ID
      const request = await this.requestsRepository.findOne({
        where: { id },
        relations: ['hr_id'], // Если нужно получить связанные сущности
      });

      // Если заявка не найдена, выбрасываем исключение
      if (!request) {
        throw new NotFoundException('Request not found');
      }

      return request;
    } catch (error) {
      // Логируем ошибку и выбрасываем исключение
      console.error('Error retrieving request by ID:', error);
      throw new DetailedInternalServerErrorException(
        'Error retrieving request by ID',
        error.message,
      );
    }
  }

  async getCurrentUser(token: string): Promise<EmployeeDto> {
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

  async findAll(): Promise<RequestResponseDto[]> {
    try {
      const requests = await this.requestsRepository.find({
        relations: ['hr_id'],
      });
      return requests.map((request) => new RequestResponseDto(request));
    } catch (error) {
      throw new DetailedInternalServerErrorException(
        'Error retrieving requests',
        error.message,
      );
    }
  }

  async findFiltered(
    params: FindFilteredParams,
  ): Promise<{ data: RequestResponseDto[]; totalPages: number; page: number }> {
    try {
      const {
        status,
        type,
        requestDateStart,
        requestDateEnd,
        updatedAtStart,
        updatedAtEnd,
        page = 1,
        limit = 10,
      } = params;

      const queryBuilder =
        this.requestsRepository.createQueryBuilder('request');

      if (status) {
        queryBuilder.andWhere('request.status = :status', { status });
      }

      if (type && type.length > 0) {
        queryBuilder.andWhere('request.type IN (:...types)', { types: type });
      }

      if (requestDateStart) {
        queryBuilder.andWhere('request.request_date >= :requestDateStart', {
          requestDateStart,
        });
      }

      if (requestDateEnd) {
        queryBuilder.andWhere('request.request_date <= :requestDateEnd', {
          requestDateEnd,
        });
      }

      if (updatedAtStart) {
        queryBuilder.andWhere('request.updated_at >= :updatedAtStart', {
          updatedAtStart,
        });
      }

      if (updatedAtEnd) {
        queryBuilder.andWhere('request.updated_at <= :updatedAtEnd', {
          updatedAtEnd,
        });
      }

      // Добавляем сортировку по created_at
      queryBuilder.orderBy('request.created_at', 'DESC');
      queryBuilder.skip((page - 1) * limit).take(limit);

      const [requests, totalRequests] = await queryBuilder
        .leftJoinAndSelect('request.hr_id', 'hr_id')
        .getManyAndCount();

      const totalPages = Math.ceil(totalRequests / limit);

      return {
        data: requests.map((request) => new RequestResponseDto(request)),
        totalPages,
        page,
      };
    } catch (error) {
      throw new DetailedInternalServerErrorException(
        'Error retrieving filtered requests',
        error.message,
      );
    }
  }

  async updateRequestType(
    id: number,
    updateRequestTypeDto: UpdateRequestTypeDto,
  ): Promise<Requests> {
    try {
      const request = await this.requestsRepository.findOne({
        where: { id },
        relations: ['hr_id'],
      });

      if (!request) {
        throw new NotFoundException('Request not found');
      }

      // Проверяем статус заявки: если CLOSED или CANCELLED, выбрасываем исключение
      if (
        request.status === RequestStatus.CLOSED ||
        request.status === RequestStatus.CANCELLED
      ) {
        throw new BadRequestException(
          'Нельзя изменять дату для заявки со статусом CLOSED или CANCELLED.',
        );
      }

      request.type = updateRequestTypeDto.new_type;

      const updatedRequest = await this.requestsRepository.save(request);

      return updatedRequest;
    } catch (error) {
      console.error('Error updating request type:', error);
      throw new DetailedInternalServerErrorException(
        'Error updating request type',
        error.message,
      );
    }
  }

  async updateRequestDate(
    id: number,
    updateRequestDateDto: UpdateRequestDateDto,
  ): Promise<Requests> {
    try {
      // Извлекаем новую дату из DTO
      const newRequestDate = updateRequestDateDto.new_request_date;

      // Преобразуем строку в дату
      const requestDate = new Date(newRequestDate);
      if (isNaN(requestDate.getTime())) {
        throw new BadRequestException('Invalid request_date format');
      }

      // Находим заявку по ID
      const request = await this.requestsRepository.findOne({
        where: { id },
        relations: ['hr_id'],
      });

      if (!request) {
        throw new NotFoundException('Request not found');
      }

      // Проверяем статус заявки: если CLOSED или CANCELLED, выбрасываем исключение
      if (
        request.status === RequestStatus.CLOSED ||
        request.status === RequestStatus.CANCELLED
      ) {
        throw new BadRequestException(
          'Нельзя изменять дату для заявки со статусом CLOSED или CANCELLED.',
        );
      }

      // Обновляем дату заявки
      request.request_date = requestDate;

      // Сохраняем изменения
      const updatedRequest = await this.requestsRepository.save(request);
      return updatedRequest;
    } catch (error) {
      console.error('Error updating request date:', error);
      return Promise.reject(
        error instanceof Error ? error : new Error(String(error)),
      );
    }
  }

  async cancelRequest(requestId: number, token: string): Promise<Requests> {
    try {
      const userId = this.extractUserIdFromToken(token);
      const request = await this.requestsRepository.findOne({
        where: { id: requestId },
        relations: ['hr_id'], // Предполагаем, что нам нужно получить данные о сотруднике
      });

      if (!request) {
        throw new NotFoundException('Request not found');
      }

      // Проверяем права доступа, если нужно
      // Например:
      // const allowedRoles = [EmployeeRole.Dispatcher, EmployeeRole.Performer];
      // await this.validateAccess(request, userId, allowedRoles);

      if (
        request.status === RequestStatus.CLOSED ||
        request.status === RequestStatus.CANCELLED
      ) {
        throw new ForbiddenException('Request is already closed or cancelled');
      }

      // Меняем статус заявки и добавляем комментарий
      request.status = RequestStatus.CANCELLED;
      const employee = await this.employeeRepository.findOne({
        where: { id: userId },
      });
      if (!employee) {
        throw new NotFoundException('Employee not found');
      }
      request.comment = `Заявка отменена сотрудником ${employee.name}`;

      // Сохраняем изменения в базе данных
      return await this.requestsRepository.save(request);
    } catch (error) {
      throw new DetailedInternalServerErrorException(
        'Error cancelling request',
        error.message,
      );
    }
  }

  async updateRequest(
    id: number,
    updateRequestDto: RequestUpdate,
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
        throw new NotFoundException('Сотрудник не найден.');
      }

      // Находим заявку по ID с включением связи с сотрудником
      const request = await this.requestsRepository.findOne({
        where: { id },
        relations: ['hr_id'],
      });

      if (!request) {
        throw new NotFoundException('Заявка не найдена.');
      }

      // Проверяем статус заявки: если CLOSED или CANCELLED, выбрасываем исключение
      if (
        request.status === RequestStatus.CLOSED ||
        request.status === RequestStatus.CANCELLED
      ) {
        throw new BadRequestException(
          'Нельзя изменять заявку со статусом CLOSED или CANCELLED.',
        );
      }

      // Обновляем поля заявки только если они переданы
      if (updateRequestDto.client_id) {
        request.client_id = updateRequestDto.client_id;
      }
      if (updateRequestDto.ep_id) {
        request.ep_id = updateRequestDto.ep_id;
      }
      if (updateRequestDto.description) {
        request.description = updateRequestDto.description;
      }
      if (updateRequestDto.address) {
        request.address = updateRequestDto.address;
      }
      if (updateRequestDto.client_contacts) {
        request.client_contacts = updateRequestDto.client_contacts;
      }

      // Связываем заявку с сотрудником HR, который обновляет её
      request.hr_id = employee;

      // Сохраняем изменения в базе данных
      return await this.requestsRepository.save(request);
    } catch (error) {
      console.error('Error updating request:', error);
      return Promise.reject(
        error instanceof Error ? error : new Error(String(error)),
      );
    }
  }
}
