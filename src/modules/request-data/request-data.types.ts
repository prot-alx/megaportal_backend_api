import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Employee } from '../employee/employee.entity';

@ObjectType()
class EmployeeResponse {
  @Field(() => ID)
  id: number;

  @Field()
  name: string;

  @Field()
  role: string;

  @Field()
  is_active: boolean;
}

@ObjectType()
export class RequestDataResponse {
  @Field(() => ID)
  id: number;

  @Field()
  request_id: number;

  @Field(() => EmployeeResponse, { nullable: true })
  hr: Employee;

  @Field({ nullable: true })
  ep_id: string;

  @Field()
  client_id: string;

  @Field()
  description: string;

  @Field()
  address: string;

  @Field(() => Date)
  request_date: Date;

  @Field()
  type: string;

  @Field({ nullable: true })
  comment: string;

  @Field()
  status: string;

  @Field(() => Date)
  request_created_at: Date;

  @Field(() => Date)
  request_updated_at: Date;

  @Field(() => EmployeeResponse, { nullable: true })
  executor: Employee;

  @Field(() => EmployeeResponse, { nullable: true })
  performer: Employee;
}
