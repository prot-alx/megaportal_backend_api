import { Resolver, Query, Args, Int, Mutation } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { RequestData } from './request-data.entity';
import { RequestDataService } from './request-data.service';
import { RequestStatus } from '../request/requests.entity';
import { Employee } from '../employee/employee.entity';
import { EmployeeDto } from '../employee/employee.dto';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { RequestDataResponseDto } from './request-data.dto';

@Resolver(() => RequestData)
@UseGuards(GqlAuthGuard)
export class RequestDataResolver {
  constructor(private readonly requestDataService: RequestDataService) {}

  // Query для получения всех заявок
  @Query(() => [RequestDataResponseDto])
  async requestDataList(): Promise<RequestDataResponseDto[]> {
    return this.requestDataService.findAll();
  }

  // Query для получения назначенных заявок
  @Query(() => [RequestDataResponseDto])
  async assignedRequests(
    @CurrentUser() user: string,
  ): Promise<RequestDataResponseDto[]> {
    return this.requestDataService.getAssignedRequests(user);
  }

  // Query для получения списка сотрудников
  @Query(() => [Employee])
  async employees(): Promise<EmployeeDto[]> {
    return this.requestDataService.getAllEmployees();
  }

  // Mutation для назначения заявки
  @Mutation(() => RequestData)
  async assignRequest(
    @Args('requestId', { type: () => Int }) requestId: number,
    @Args('performerId', { type: () => Int, nullable: true })
    performerId: number | null,
    @CurrentUser() token: string,
  ): Promise<RequestData> {
    return this.requestDataService.assignRequest(requestId, performerId, token);
  }

  // Mutation для изменения статуса заявки
  @Mutation(() => Boolean)
  async changeRequestStatus(
    @Args('requestId', { type: () => Int }) requestId: number,
    @Args('status', { type: () => RequestStatus }) status: RequestStatus,
    @CurrentUser() token: string,
  ): Promise<boolean> {
    await this.requestDataService.changeRequestStatus(requestId, status, token);
    return true;
  }

  // Mutation для добавления комментария
  @Mutation(() => Boolean)
  async addComment(
    @Args('requestId', { type: () => Int }) requestId: number,
    @Args('comment') comment: string,
    @CurrentUser() token: string,
  ): Promise<boolean> {
    await this.requestDataService.addComment(requestId, comment, token);
    return true;
  }

  // Mutation для закрытия заявки
  @Mutation(() => Boolean)
  async closeRequest(
    @Args('requestId', { type: () => Int }) requestId: number,
    @CurrentUser() token: string,
  ): Promise<boolean> {
    await this.requestDataService.closeRequest(requestId, token);
    return true;
  }
}
