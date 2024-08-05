import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions } from 'typeorm';
import { Requests } from './requests.entity';

@Injectable()
export class RequestsService {
  constructor(
    @InjectRepository(Requests)
    private readonly requestsRepository: Repository<Requests>,
  ) {}

  async findAll(): Promise<Requests[]> {
    return this.requestsRepository.find();
  }

  async create(data: Partial<Requests>): Promise<Requests> {
    const newRequest = this.requestsRepository.create(data);
    return this.requestsRepository.save(newRequest);
  }

  async findOne(id: number): Promise<Requests> {
    return this.requestsRepository.findOne({ where: { id } });
  }

  async update(id: number, data: Partial<Requests>): Promise<Requests> {
    await this.requestsRepository.update(id, data);
    return this.requestsRepository.findOne({ where: { id } });
  }
}
