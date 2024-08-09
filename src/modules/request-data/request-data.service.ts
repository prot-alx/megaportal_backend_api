import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RequestData } from './request-data.entity';
import { Employee } from '../employee/employee.entity';
import { Requests } from '../request/requests.entity';
import { UserResponseDto } from '../employee/employee.dto';

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

  private extractUserIdFromToken(token: string): number {
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

  async assignRequest(
    requestId: number,
    performerId: number,
    token: string,
  ): Promise<RequestData> {
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

    const requestData = this.requestDataRepository.create({
      request,
      executor_id: executor,
      performer_id: performer,
    });

    return this.requestDataRepository.save(requestData);
  }

  async findAll(): Promise<any[]> {
    const requestData = await this.requestDataRepository.find({
      relations: ['request', 'executor_id', 'performer_id'],
    });

    return requestData.map((data) => ({
      ...data,
      executor_id: this.transformEmployeeToDto(data.executor_id),
      performer_id: this.transformEmployeeToDto(data.performer_id),
    }));
  }
}
