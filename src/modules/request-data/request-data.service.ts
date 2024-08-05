import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RequestData } from './request-data.entity';

@Injectable()
export class RequestDataService {
  constructor(
    @InjectRepository(RequestData)
    private readonly requestDataRepository: Repository<RequestData>,
  ) {}

  async findAll(): Promise<RequestData[]> {
    return this.requestDataRepository.find();
  }

  async create(data: Partial<RequestData>): Promise<RequestData> {
    const newRequestData = this.requestDataRepository.create(data);
    return this.requestDataRepository.save(newRequestData);
  }

  async findOne(id: number): Promise<RequestData> {
    return this.requestDataRepository.findOne({ where: { id } });
  }

  async update(id: number, data: Partial<RequestData>): Promise<RequestData> {
    await this.requestDataRepository.update(id, data);
    return this.requestDataRepository.findOne({ where: { id } });
  }
}
