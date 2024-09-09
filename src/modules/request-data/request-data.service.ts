import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RequestData } from './request-data.entity';
import { Employee, EmployeeRole } from '../employee/employee.entity';
import { Requests, RequestStatus } from '../request/requests.entity';
import { UserResponseDto } from '../employee/employee.dto';
import { DetailedInternalServerErrorException } from 'src/error/all-exceptions.filter';
import { RequestDataResponseDto } from './request-data.dto';

@Injectable()
export class RequestDataService {
  constructor(
    @InjectRepository(RequestData)
    private requestDataRepository: Repository<RequestData>,
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    @InjectRepository(Requests)
    private requestsRepository: Repository<Requests>,
    private jwtService: JwtService,
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
  private transformEmployeeToDto(employee: Employee): UserResponseDto {
    return {
      id: employee.id,
      name: employee.name,
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

  // Назначение заявки исполнителю
  async assignRequest(
    requestId: number,
    performerId: number,
    token: string,
  ): Promise<RequestData> {
    try {
      const executorId = this.extractUserIdFromToken(token);

      // Находим сущности заявок и сотрудников
      const request = await this.requestsRepository.findOne({
        where: { id: requestId },
      });
      const executor = await this.employeeRepository.findOne({
        where: { id: executorId },
      });
      const performer = await this.employeeRepository.findOne({
        where: { id: performerId },
      });

      if (!request || !executor || !performer) {
        throw new UnauthorizedException('Request or Сотрудник не найден.');
      }

      // Проверяем статус заявки
      if (
        [RequestStatus.CLOSED, RequestStatus.CANCELLED].includes(request.status)
      ) {
        throw new ForbiddenException(
          'Request is closed or cancelled and cannot be modified',
        );
      }

      // Проверяем, не назначен ли уже этот сотрудник на эту заявку
      const existingAssignment = await this.requestDataRepository.findOne({
        where: {
          request: { id: requestId },
          performer_id: { id: performerId },
        },
      });

      if (existingAssignment) {
        throw new UnauthorizedException(
          'This performer is already assigned to the request',
        );
      }

      // Изменяем статус заявки на IN_PROGRESS, если он сейчас NEW
      if (request.status === RequestStatus.NEW) {
        request.status = RequestStatus.IN_PROGRESS;
        await this.requestsRepository.save(request);
      }

      const requestData = this.requestDataRepository.create({
        request,
        executor_id: executor,
        performer_id: performer,
      });

      return await this.requestDataRepository.save(requestData);
    } catch (error) {
      throw new DetailedInternalServerErrorException(
        'Error assigning request',
        error.message,
      );
    }
  }

  // Удаление исполнителя из заявки
  async removePerformer(requestId: number, performerId: number): Promise<void> {
    console.log(requestId, performerId);
    try {
      const request = await this.requestsRepository.findOne({
        where: { id: requestId },
      });

      console.log(request);

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

      // Удаляем исполнителя
      const deleteResult = await this.requestDataRepository.delete({
        request: { id: requestId },
        performer_id: { id: performerId },
      });

      if (deleteResult.affected === 0) {
        throw new UnauthorizedException('Performer not found for this request');
      }

      // Проверяем, остались ли еще исполнители для этой заявки
      const remainingPerformers = await this.requestDataRepository.count({
        where: { request: { id: requestId } },
      });

      // Если исполнителей не осталось, меняем статус на NEW
      if (remainingPerformers === 0) {
        request.status = RequestStatus.NEW;
        await this.requestsRepository.save(request);
      }
    } catch (error) {
      throw new DetailedInternalServerErrorException(
        'Error removing performer',
        error.message,
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

      const allowedRoles = [EmployeeRole.Dispatcher, EmployeeRole.Performer];
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
        relations: ['request', 'executor_id', 'performer_id'],
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
  async getAllEmployees(): Promise<UserResponseDto[]> {
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
  async getPerformersForRequest(requestId: number): Promise<UserResponseDto[]> {
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
      throw new NotFoundException(
        'Error replacing performer',
        error.message,
      );
    }
  }

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
