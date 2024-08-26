import { EmployeeRole } from 'src/modules/employee/employee.entity';

export interface JwtPayload {
  id: number; // идентификатор сотрудника
  login: string; // логин сотрудника
  role: EmployeeRole; // роль сотрудника
  is_active: boolean; // статус активности
  name: string;
}
