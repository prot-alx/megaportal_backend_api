import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RequestData } from './request-data.entity';
import { Employee } from '../employee/employee.entity';
import { Requests } from '../request/requests.entity';
import { CreateRequestDataDto, UpdateRequestDataDto } from './request-data.dto';

@Injectable()
export class RequestDataService {
  constructor(
    @InjectRepository(RequestData)
    private readonly requestDataRepository: Repository<RequestData>,
    @InjectRepository(Requests)
    private readonly requestsRepository: Repository<Requests>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>
  ) {}

  // Метод для создания записи о назначении сотрудников на заявку
  async create(createRequestDataDto: CreateRequestDataDto): Promise<RequestData> {
    const { requestId, executorId, performerId } = createRequestDataDto;

    // Проверка существования заявки
    const request = await this.requestsRepository.findOne({
      where: { id: requestId }
    });
    if (!request) {
      throw new NotFoundException(`Request with ID ${requestId} not found`);
    }

    // Проверка существования сотрудников
    const executor = await this.employeeRepository.findOne({
      where: { id: executorId }
    });
    const performer = await this.employeeRepository.findOne({
      where: { id: performerId }
    });
    if (!executor || !performer) {
      throw new NotFoundException('Executor or Performer not found');
    }

    const newRequestData = this.requestDataRepository.create({
      request,
      executor,
      performer
    });

    return await this.requestDataRepository.save(newRequestData);
  }

  // Метод для обновления записи о назначении сотрудников на заявку
  async update(id: number, updateRequestDataDto: UpdateRequestDataDto): Promise<RequestData> {
    const requestData = await this.requestDataRepository.findOne({
      where: { id }
    });

    if (!requestData) {
      throw new NotFoundException(`RequestData with ID ${id} not found`);
    }

    const { requestId, executorId, performerId } = updateRequestDataDto;

    // Обновление заявки и сотрудников, если они переданы
    const request = requestId ? await this.requestsRepository.findOne({ where: { id: requestId } }) : requestData.request;
    const executor = executorId ? await this.employeeRepository.findOne({ where: { id: executorId } }) : requestData.executor;
    const performer = performerId ? await this.employeeRepository.findOne({ where: { id: performerId } }) : requestData.performer;

    if (requestId && !request) {
      throw new NotFoundException(`Request with ID ${requestId} not found`);
    }
    if (executorId && !executor) {
      throw new NotFoundException(`Executor with ID ${executorId} not found`);
    }
    if (performerId && !performer) {
      throw new NotFoundException(`Performer with ID ${performerId} not found`);
    }

    this.requestDataRepository.merge(requestData, {
      request,
      executor,
      performer
    });

    return await this.requestDataRepository.save(requestData);
  }

  // Метод для получения всех записей
  async findAll(): Promise<RequestData[]> {
    return this.requestDataRepository.find({ relations: ['request', 'executor', 'performer'] });
  }

  // Метод для получения записи по ID
  async findOne(id: number): Promise<RequestData> {
    const requestData = await this.requestDataRepository.findOne({
      where: { id },
      relations: ['request', 'executor', 'performer']
    });

    if (!requestData) {
      throw new NotFoundException(`RequestData with ID ${id} not found`);
    }

    return requestData;
  }
}
