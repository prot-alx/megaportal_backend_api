import {
  ForbiddenException,
  Injectable,
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

      if (request.status === RequestStatus.CLOSED) {
        throw new ForbiddenException(
          'Request is closed and cannot be modified',
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

  private transformEmployeeToDto(employee: Employee): UserResponseDto {
    return {
      id: employee.id,
      name: employee.name,
    };
  }

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
        throw new UnauthorizedException('Request or Employee not found');
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

  async removePerformer(requestId: number, performerId: number): Promise<void> {
    try {
      const request = await this.requestsRepository.findOne({
        where: { id: requestId },
      });

      if (!request) {
        throw new UnauthorizedException('Request not found');
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

  async changeRequestStatus(
    requestId: number,
    newStatus: RequestStatus,
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

      request.status = newStatus;
      await this.requestsRepository.save(request);
    } catch (error) {
      throw new DetailedInternalServerErrorException(
        'Error changing request status',
        error.message,
      );
    }
  }

  async getAssignedRequests(token: string): Promise<Requests[]> {
    try {
      const userId = this.extractUserIdFromToken(token);

      // Находим все записи RequestData, где текущий пользователь назначен исполнителем
      const assignedRequestData = await this.requestDataRepository.find({
        where: { performer_id: { id: userId } },
        relations: ['request'],
      });

      // Возвращаем список заявок, назначенных текущему пользователю
      return assignedRequestData.map((data) => data.request);
    } catch (error) {
      throw new DetailedInternalServerErrorException(
        'Error retrieving assigned requests',
        error.message,
      );
    }
  }

  async findAll(): Promise<any[]> {
    try {
      const requestData = await this.requestDataRepository.find({
        relations: ['request', 'executor_id', 'performer_id'],
      });

      return requestData.map((data) => ({
        ...data,
        executor_id: this.transformEmployeeToDto(data.executor_id),
        performer_id: this.transformEmployeeToDto(data.performer_id),
      }));
    } catch (error) {
      throw new DetailedInternalServerErrorException(
        'Error retrieving all request data',
        error.message,
      );
    }
  }
}
