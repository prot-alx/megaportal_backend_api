import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Requests } from './requests.entity';
import { CreateRequestDto, UpdateRequestDto } from './request.dto';
import { Employee, EmployeeRole } from '../employee/employee.entity';

@Injectable()
export class RequestsService {
  constructor(
    @InjectRepository(Requests)
    private readonly requestsRepository: Repository<Requests>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>
  ) {}

  async create(createRequestDto: CreateRequestDto): Promise<Requests> {
    const { epId, requestDate, type, description, address, comment, status } = createRequestDto;

    // Fetch HR (or Dispatcher) from your system
    const hr = await this.employeeRepository.findOne({ where: { role: EmployeeRole.Dispatcher } });

    if (!hr) {
      throw new NotFoundException('HR (Dispatcher) not found');
    }

    const newRequest = this.requestsRepository.create({
      epId,
      requestDate,
      type,
      description,
      address,
      comment,
      status,
      hr, // Set the HR who created the request
    });

    return await this.requestsRepository.save(newRequest);
  }

  async update(id: number, updateRequestDto: UpdateRequestDto): Promise<Requests> {
    const request = await this.requestsRepository.findOne({ where: { id } });

    if (!request) {
      throw new NotFoundException(`Request with ID ${id} not found`);
    }

    const { epId, requestDate, type, description, address, comment, status, hrId } = updateRequestDto;

    // Fetch HR if necessary
    const hr = hrId ? await this.employeeRepository.findOne({ where: { id: hrId } }) : request.hr;

    if (hrId && !hr) {
      throw new NotFoundException(`HR with ID ${hrId} not found`);
    }

    this.requestsRepository.merge(request, {
      epId,
      requestDate,
      type,
      description,
      address,
      comment,
      status,
      hr, // Update HR if provided
    });

    return await this.requestsRepository.save(request);
  }

  async findAll(): Promise<Requests[]> {
    return this.requestsRepository.find({ relations: ['hr'] }); // Ensure HR is included in the response
  }

  async findOne(id: number): Promise<Requests> {
    const request = await this.requestsRepository.findOne({ where: { id }, relations: ['hr'] });

    if (!request) {
      throw new NotFoundException(`Request with ID ${id} not found`);
    }

    return request;
  }

  async remove(id: number): Promise<void> {
    const result = await this.requestsRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Request with ID ${id} not found`);
    }
  }
}
