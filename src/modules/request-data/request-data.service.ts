import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { RequestData } from './request-data.entity';
import { Employee, EmployeeRole } from '../employee/employee.entity';
import {
  Requests,
  RequestStatus,
  RequestType,
} from '../request/requests.entity';
import { EmployeeDto } from '../employee/employee.dto';
import { DetailedInternalServerErrorException } from 'src/error/all-exceptions.filter';
import { CreateRequestDto, RequestDataResponseDto } from './request-data.dto';

interface FilterOptions {
  type?: RequestType[];
  status?: RequestStatus[];
  executor_id?: number;
  performer_id?: number;
  request_date_from?: Date;
  request_date_to?: Date;
  updated_at_from?: Date;
  updated_at_to?: Date;
  page?: number;
  limit?: number;
}

@Injectable()
export class RequestDataService {
  constructor(
    @InjectRepository(RequestData)
    private readonly requestDataRepository: Repository<RequestData>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(Requests)
    private readonly requestsRepository: Repository<Requests>,
    private readonly jwtService: JwtService,
  ) {}

  // Проверка доступа к заявке
  private async validateAccess(
    request: Requests,
    userId: number,
    roles: EmployeeRole[],
  ): Promise<void> {
    try {
      const employee = await this.employeeRepository.findOne({
        where: { id: userId },
      });

      if (!employee || !roles.includes(employee.role)) {
        throw new ForbiddenException(
          'You do not have permission to change the status of this request',
        );
      }

      if (
        [RequestStatus.CLOSED, RequestStatus.CANCELLED].includes(request.status)
      ) {
        throw new ForbiddenException(
          'Request is closed or cancelled and cannot be modified',
        );
      }

      const isPerformer = await this.requestDataRepository.findOne({
        where: {
          request: { id: request.id },
          performer_id: { id: userId },
        },
      });

      if (employee.role === EmployeeRole.Performer && !isPerformer) {
        throw new ForbiddenException('You are not assigned to this request');
      }
    } catch (error) {
      throw new DetailedInternalServerErrorException(
        'Error validating access',
        error.message,
      );
    }
  }

  // Извлечение ID пользователя из токена
  private extractUserIdFromToken(token: string): number {
    try {
      const decodedToken = this.jwtService.decode(token);
      if (!decodedToken?.id) {
        throw new UnauthorizedException('Invalid or missing token');
      }
      return decodedToken.id;
    } catch (error) {
      throw new DetailedInternalServerErrorException(
        'Error extracting user ID from token',
        error.message,
      );
    }
  }

  // Преобразование сотрудника в DTO
  private transformEmployeeToDto(employee: Employee): EmployeeDto {
    return {
      id: employee.id,
      name: employee.name,
      role: employee.role,
      is_active: employee.is_active,
    };
  }

  // Получение имени сотрудника
  private async getEmployeeName(employeeId: number): Promise<string> {
    const employee = await this.employeeRepository.findOne({
      where: { id: employeeId },
    });
    if (!employee) {
      throw new UnauthorizedException('Сотрудник не найден.');
    }
    return employee.name;
  }

  // Получение заявок с фильтрацией
  async getRequestsWithFilters(filters: FilterOptions) {
    const {
      type: typeStrings,
      status: statusStrings,
      executor_id,
      performer_id,
      request_date_from,
      request_date_to,
      updated_at_from,
      updated_at_to,
      page = 1,
      limit = 10,
    } = filters;

    const queryBuilder = this.initializeQueryBuilder();

    this.applyDateFilters(queryBuilder, { request_date_from, request_date_to });
    this.applyTypeFilter(queryBuilder, typeStrings);
    this.applyStatusFilter(queryBuilder, statusStrings);
    this.applyExecutorFilter(queryBuilder, executor_id);
    this.applyPerformerFilter(queryBuilder, performer_id);
    this.applyUpdateAtFilters(queryBuilder, { updated_at_from, updated_at_to });

    // Применяем сортировку
    this.applySorting(queryBuilder, statusStrings);

    const totalRequests = await queryBuilder.getCount();
    const requests = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    const formattedRequests = this.formatRequests(requests);

    return this.buildResponse(formattedRequests, totalRequests, page, limit);
  }

  private applySorting(queryBuilder, statusStrings) {
    if (!statusStrings) return;

    const statuses = this.mapToValidStatuses(statusStrings);

    const isClosedAndCancelled =
      statuses.includes(RequestStatus.CLOSED) &&
      statuses.includes(RequestStatus.CANCELLED);

    if (isClosedAndCancelled) {
      queryBuilder.orderBy('performer.name', 'ASC');
    } else if (statuses.includes(RequestStatus.NEW)) {
      queryBuilder.orderBy('request.created_at', 'DESC');
    } else if (
      statuses.includes(RequestStatus.IN_PROGRESS) ||
      statuses.includes(RequestStatus.MONITORING) ||
      statuses.includes(RequestStatus.POSTPONED)
    ) {
      queryBuilder.orderBy('performer.name', 'ASC');
    } else if (statuses.includes(RequestStatus.SUCCESS)) {
      queryBuilder.orderBy('request.updated_at', 'DESC');
    } else if (statuses.includes(RequestStatus.CLOSED)) {
      queryBuilder.orderBy('request.updated_at', 'DESC');
    } else if (statuses.includes(RequestStatus.CANCELLED)) {
      queryBuilder.orderBy('performer.name', 'ASC');
    }
  }

  private initializeQueryBuilder() {
    return this.requestDataRepository
      .createQueryBuilder('request_data')
      .leftJoinAndSelect('request_data.request', 'request')
      .leftJoinAndSelect('request_data.executor_id', 'executor')
      .leftJoinAndSelect('request_data.performer_id', 'performer')
      .leftJoinAndSelect('request.hr_id', 'hr');
  }

  private applyDateFilters(queryBuilder, dates) {
    const { request_date_from, request_date_to } = dates;
    if (request_date_from)
      queryBuilder.andWhere('request.request_date >= :request_date_from', {
        request_date_from,
      });
    if (request_date_to)
      queryBuilder.andWhere('request.request_date <= :request_date_to', {
        request_date_to,
      });
  }

  private applyTypeFilter(queryBuilder, typeStrings) {
    if (!typeStrings) return;
    const types = this.mapToValidTypes(typeStrings);
    if (types && types.length > 0) {
      queryBuilder.andWhere('request.type IN (:...types)', { types });
    }
  }

  private mapToValidTypes(typeStrings): RequestType[] {
    const typeArray = Array.isArray(typeStrings) ? typeStrings : [typeStrings];
    return typeArray.map((typeString) => {
      if (!Object.values(RequestType).includes(typeString)) {
        throw new BadRequestException(`Invalid request type: ${typeString}`);
      }
      return typeString;
    });
  }

  private applyStatusFilter(queryBuilder, statusStrings) {
    if (!statusStrings) return;
    const statuses = this.mapToValidStatuses(statusStrings);
    if (statuses && statuses.length > 0) {
      queryBuilder.andWhere('request.status IN (:...statuses)', { statuses });
    }
  }

  private mapToValidStatuses(statusStrings): RequestStatus[] {
    const statusArray = Array.isArray(statusStrings)
      ? statusStrings
      : [statusStrings];
    return statusArray.map((statusString) => {
      if (!Object.values(RequestStatus).includes(statusString)) {
        throw new BadRequestException(
          `Invalid request status: ${statusString}`,
        );
      }
      return statusString;
    });
  }

  private applyExecutorFilter(queryBuilder, executor_id) {
    if (executor_id)
      queryBuilder.andWhere('request_data.executor_id = :executor_id', {
        executor_id,
      });
  }

  private applyPerformerFilter(queryBuilder, performer_id) {
    if (performer_id)
      queryBuilder.andWhere('request_data.performer_id = :performer_id', {
        performer_id,
      });
  }

  private applyUpdateAtFilters(queryBuilder, dates) {
    const { updated_at_from, updated_at_to } = dates;
    if (updated_at_from)
      queryBuilder.andWhere('request.updated_at >= :updated_at_from', {
        updated_at_from,
      });
    if (updated_at_to)
      queryBuilder.andWhere('request.updated_at <= :updated_at_to', {
        updated_at_to,
      });
  }

  private formatRequests(requests) {
    return requests.map((requestData) => {
      return {
        id: requestData.id,
        request: {
          id: requestData.request.id,
          type: requestData.request.type,
          ep_id: requestData.request.ep_id,
          client: requestData.request.client_id,
          contacts: requestData.request.client_contacts,
          description: requestData.request.description,
          address: requestData.request.address,
          comment: requestData.request.comment,
          status: requestData.request.status,
          request_date: requestData.request.request_date,
          request_updated_at: requestData.request.updated_at,
          request_created_at: requestData.request.created_at,
          hr: requestData.request.hr_id
            ? {
                id: requestData.request.hr_id.id,
                name: requestData.request.hr_id.name,
                role: requestData.request.hr_id.role,
                is_active: requestData.request.hr_id.is_active,
              }
            : null,
        },
        executor: requestData.executor_id
          ? {
              id: requestData.executor_id.id,
              name: requestData.executor_id.name,
              role: requestData.executor_id.role,
              is_active: requestData.executor_id.is_active,
            }
          : null,
        performer: requestData.performer_id
          ? {
              id: requestData.performer_id.id,
              name: requestData.performer_id.name,
              role: requestData.performer_id.role,
              is_active: requestData.performer_id.is_active,
            }
          : null,
      };
    });
  }

  private buildResponse(formattedRequests, totalRequests, page, limit) {
    return {
      totalPages: Math.ceil(totalRequests / limit),
      currentPage: page,
      limit,
      totalRequests,
      requests: formattedRequests,
    };
  }

  // Создать заявку
  async create(
    createRequestDto: CreateRequestDto,
    token: string,
  ): Promise<{ message: string }> {
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
        created_at: new Date(),
        updated_at: new Date(),
        hr_id: employee,
        request_date: requestDate,
        status: createRequestDto.status || RequestStatus.NEW,
      });

      // Сохраняем заявку в базе данных
      const savedRequest = await this.requestsRepository.save(request);

      // Создаем запись в request_data
      const requestData = this.requestDataRepository.create({
        request: savedRequest,
        executor_id: null,
        performer_id: null,
        created_at: new Date(),
        updated_at: new Date(),
      });

      await this.requestDataRepository.save(requestData);

      return { message: 'Заявка успешно создана' };
    } catch (error) {
      throw new DetailedInternalServerErrorException(
        'Error creating request',
        error.message,
      );
    }
  }

  // Назначение заявки исполнителю
  async assignRequest(
    requestId: number,
    performerId: number | null,
    token: string,
  ): Promise<RequestData> {
    try {
      const executorId = this.extractUserIdFromToken(token);

      // Находим запись в request_data по requestId
      const existingRequestData = await this.requestDataRepository.findOne({
        where: { request: { id: requestId } },
        relations: ['request'],
      });

      if (!existingRequestData) {
        throw new NotFoundException('Request not found in request_data');
      }

      // Получаем связанную заявку
      const request = existingRequestData.request;

      // Находим сотрудника, который назначает
      const executor = await this.employeeRepository.findOne({
        where: { id: executorId },
      });

      // Если исполнитель указан, проверяем его существование
      if (!executor) {
        throw new NotFoundException('Executor not found');
      }

      // Если performerId указан, находим перформера
      let performer = null;
      if (performerId) {
        performer = await this.employeeRepository.findOne({
          where: { id: performerId },
        });

        if (!performer) {
          throw new NotFoundException('Performer not found');
        }
      }

      // Проверяем статус заявки
      if (
        [RequestStatus.CLOSED, RequestStatus.CANCELLED].includes(request.status)
      ) {
        throw new ForbiddenException(
          'Request is closed or cancelled and cannot be modified',
        );
      }

      // Если заявка уже имеет исполнителя, дублируем запись
      if (existingRequestData.performer_id) {
        // Создаем новую запись с тем же request_id и новым performer_id
        const newRequestData = this.requestDataRepository.create({
          request,
          executor_id: executor,
          performer_id: performer || null,
          updated_at: new Date(),
        });

        return await this.requestDataRepository.save(newRequestData);
      } else {
        // Обновляем существующую запись
        existingRequestData.executor_id = executor;
        existingRequestData.performer_id = performer || null;
        existingRequestData.updated_at = new Date();
        request.status = RequestStatus.IN_PROGRESS;
        await this.requestsRepository.save(request);

        return await this.requestDataRepository.save(existingRequestData);
      }
    } catch (error) {
      throw new DetailedInternalServerErrorException(
        'Error assigning request',
        error.message,
      );
    }
  }

  // Удаление исполнителя из заявки
  async removePerformer(
    request_id: number,
    performer_id: number,
  ): Promise<void> {
    try {
      const request = await this.requestsRepository.findOne({
        where: { id: request_id },
      });

      if (!request) {
        throw new UnauthorizedException('Request not found');
      }

      // Проверка статуса заявки
      if (
        [RequestStatus.CLOSED, RequestStatus.CANCELLED].includes(request.status)
      ) {
        throw new ForbiddenException(
          'Request is closed or cancelled and cannot be modified',
        );
      }

      // Обновляем performer_id и executor_id на null
      const updateResult = await this.requestDataRepository.update(
        {
          request: { id: request_id },
          performer_id: { id: performer_id },
        },
        {
          performer_id: null,
          executor_id: null,
          updated_at: new Date(),
        },
      );

      if (updateResult.affected === 0) {
        throw new UnauthorizedException('Performer not found for this request');
      }

      // Проверяем, остались ли еще исполнители для этой заявки
      const remainingPerformers = await this.requestDataRepository.count({
        where: { request: { id: request_id }, performer_id: Not(null) },
      });

      // Если исполнителей не осталось, меняем статус на NEW
      if (remainingPerformers === 0) {
        request.status = RequestStatus.NEW;
        await this.requestsRepository.save(request);
      }
    } catch (error) {
      return Promise.reject(
        error instanceof Error ? error : new Error(String(error)),
      );
    }
  }

  // Изменение статуса заявки
  async changeRequestStatus(
    requestId: number,
    newStatus: RequestStatus,
    token: string,
  ): Promise<void> {
    try {
      // Запрещаем изменение статуса на CLOSED или CANCELLED через этот метод
      if ([RequestStatus.CLOSED, RequestStatus.CANCELLED].includes(newStatus)) {
        throw new ForbiddenException(
          'Changing the status to CLOSED or CANCELLED is not allowed through this method',
        );
      }

      const userId = this.extractUserIdFromToken(token);
      const request = await this.requestsRepository.findOne({
        where: { id: requestId },
      });

      if (!request) {
        throw new UnauthorizedException('Request not found');
      }

      const allowedRoles = [EmployeeRole.Dispatcher, EmployeeRole.Performer];
      await this.validateAccess(request, userId, allowedRoles);

      request.status = newStatus;
      await this.requestsRepository.save(request);
    } catch (error) {
      throw new DetailedInternalServerErrorException(
        'Error changing request status',
        error.message,
      );
    }
  }

  // Получить записи назначенных заявок на конкретного пользователя
  async getAssignedRequests(token: string): Promise<RequestDataResponseDto[]> {
    try {
      const userId = this.extractUserIdFromToken(token);

      // Находим все записи RequestData, где текущий пользователь назначен исполнителем
      const assignedRequestData = await this.requestDataRepository.find({
        where: { performer_id: { id: userId } },
        relations: ['request', 'executor_id', 'performer_id'],
      });

      // Преобразуем данные в RequestDataResponseDto и возвращаем результат
      return assignedRequestData.map(
        (data) => new RequestDataResponseDto(data),
      );
    } catch (error) {
      throw new DetailedInternalServerErrorException(
        'Error retrieving assigned requests',
        error.message,
      );
    }
  }

  // Метод для перевода заявки в статус CANCELLED
  async cancelRequest(requestId: number, token: string): Promise<void> {
    try {
      const userId = this.extractUserIdFromToken(token);
      const request = await this.requestsRepository.findOne({
        where: { id: requestId },
      });

      if (!request) {
        throw new UnauthorizedException('Request not found');
      }

      const allowedRoles = [EmployeeRole.Dispatcher, EmployeeRole.Performer];
      await this.validateAccess(request, userId, allowedRoles);

      if (
        request.status === RequestStatus.CLOSED ||
        request.status === RequestStatus.CANCELLED
      ) {
        throw new ForbiddenException('Request is already closed or cancelled');
      }

      request.status = RequestStatus.CANCELLED;
      request.comment = `Заявка отменена сотрудником ${await this.getEmployeeName(userId)}`;
      await this.requestsRepository.save(request);
    } catch (error) {
      throw new DetailedInternalServerErrorException(
        'Error cancelling request',
        error.message,
      );
    }
  }

  // Добавление комментария к заявке
  async addComment(
    requestId: number,
    comment: string,
    token: string,
  ): Promise<void> {
    try {
      const userId = this.extractUserIdFromToken(token);
      const request = await this.requestsRepository.findOne({
        where: { id: requestId },
      });

      if (!request) {
        throw new UnauthorizedException('Request not found');
      }

      const allowedRoles = [
        EmployeeRole.Dispatcher,
        EmployeeRole.Performer,
        EmployeeRole.Storekeeper,
      ];
      await this.validateAccess(request, userId, allowedRoles);

      const employee = await this.employeeRepository.findOne({
        where: { id: userId },
      });

      const updatedComment = `${employee.name}: ${comment}`;

      if (request.comment) {
        request.comment += `\n${updatedComment}`;
      } else {
        request.comment = updatedComment;
      }

      await this.requestsRepository.save(request);
    } catch (error) {
      throw new DetailedInternalServerErrorException(
        'Error adding comment to request',
        error.message,
      );
    }
  }

  // Закрытие заявки
  async closeRequest(requestId: number, token: string): Promise<void> {
    try {
      const userId = this.extractUserIdFromToken(token);
      const request = await this.requestsRepository.findOne({
        where: { id: requestId },
      });

      if (!request) {
        throw new UnauthorizedException('Request not found');
      }

      const allowedRoles = [EmployeeRole.Dispatcher, EmployeeRole.Performer];
      await this.validateAccess(request, userId, allowedRoles);

      if (!request.comment) {
        throw new ForbiddenException(
          'Comment is required to close the request',
        );
      }

      request.status = RequestStatus.CLOSED;
      await this.requestsRepository.save(request);
    } catch (error) {
      throw new DetailedInternalServerErrorException(
        'Error closing request',
        error.message,
      );
    }
  }

  // Все назначенные заявки (без фильтрации)
  async findAll(): Promise<RequestDataResponseDto[]> {
    try {
      const requestData = await this.requestDataRepository.find({
        relations: ['request', 'request.hr_id', 'executor_id', 'performer_id'],
      });
      return requestData.map((data) => new RequestDataResponseDto(data));
    } catch (error) {
      throw new DetailedInternalServerErrorException(
        'Error retrieving request data',
        error.message,
      );
    }
  }

  // Получение общего списка исполнителей
  async getAllEmployees(): Promise<EmployeeDto[]> {
    try {
      const employees = await this.employeeRepository.find();
      return employees.map(this.transformEmployeeToDto);
    } catch (error) {
      throw new DetailedInternalServerErrorException(
        'Error retrieving employees',
        error.message,
      );
    }
  }

  // Получение назначенных на конкретную заявку исполнителей
  async getPerformersForRequest(requestId: number): Promise<EmployeeDto[]> {
    try {
      const requestData = await this.requestDataRepository.find({
        where: { request: { id: requestId } },
        relations: ['performer_id'],
      });

      // Извлечение уникальных исполнителей
      const performers = requestData.map((data) => data.performer_id);
      return [
        ...new Map(
          performers.map((performer) => [performer.id, performer]),
        ).values(),
      ].map(this.transformEmployeeToDto);
    } catch (error) {
      throw new DetailedInternalServerErrorException(
        'Error retrieving performers for request',
        error.message,
      );
    }
  }

  // Получение списка всех заявок и соответствующих исполнителей
  async getRequestsAndPerformers(): Promise<RequestDataResponseDto[]> {
    try {
      const requestData = await this.requestDataRepository.find({
        relations: ['request', 'executor_id', 'performer_id'],
      });
      return requestData.map((data) => new RequestDataResponseDto(data));
    } catch (error) {
      throw new DetailedInternalServerErrorException(
        'Error retrieving requests and performers',
        error.message,
      );
    }
  }

  // Замена исполнителя в заявке
  async replacePerformer(
    requestId: number,
    currentPerformerId: number,
    newPerformerId: number,
    token: string,
  ): Promise<void> {
    try {
      // Находим заявку
      const request = await this.requestsRepository.findOne({
        where: { id: requestId },
      });

      if (!request) {
        throw new NotFoundException('Request not found');
      }

      // Проверка статуса заявки
      if (
        [RequestStatus.CLOSED, RequestStatus.CANCELLED].includes(request.status)
      ) {
        throw new ForbiddenException(
          'Request is closed or cancelled and cannot be modified',
        );
      }

      // Находим запись текущего исполнителя
      const currentAssignment = await this.requestDataRepository.findOne({
        where: {
          request: { id: requestId },
          performer_id: { id: currentPerformerId },
        },
        relations: ['performer_id'],
      });

      if (!currentAssignment) {
        throw new NotFoundException(
          'Current performer not found for this request',
        );
      }

      // Проверяем, существует ли новый исполнитель
      const newPerformer = await this.employeeRepository.findOne({
        where: { id: newPerformerId },
      });

      if (!newPerformer) {
        throw new NotFoundException('New performer does not exist');
      }

      // Проверяем, не назначен ли уже новый исполнитель на эту заявку
      const existingAssignment = await this.requestDataRepository.findOne({
        where: {
          request: { id: requestId },
          performer_id: { id: newPerformerId },
        },
        relations: ['performer_id'],
      });

      if (existingAssignment) {
        throw new ConflictException(
          'This new performer is already assigned to the request',
        );
      }

      // Обновляем текущего исполнителя на нового
      currentAssignment.performer_id = newPerformer;

      // Сохраняем изменения
      await this.requestDataRepository.save(currentAssignment);
    } catch (error) {
      console.error('Error replacing performer:', error);
      throw new NotFoundException('Error replacing performer', error.message);
    }
  }

  // 
  async getAssignmentByRequestIdAndPerformerId(
    requestId: number,
    performerId: number,
  ): Promise<RequestData | null> {
    try {
      return await this.requestDataRepository.findOne({
        where: {
          request: { id: requestId },
          performer_id: { id: performerId },
        },
        relations: ['performer_id'],
      });
    } catch (error) {
      throw new DetailedInternalServerErrorException(
        'Error retrieving assignment',
        error.message,
      );
    }
  }
}
