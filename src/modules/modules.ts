import { AuditLogModule } from './audit-log/audit-log.module';
import { BackpackEmployeeModule } from './backpack-employee/backpack-employee.module';
import { EmployeeModule } from './employee/employee.module';
import { MaterialCategoryModule } from './material-category/material-category.module';
import { MaterialConsumptionModule } from './material-consumption/material-consumption.module';
import { MaterialSubtypeModule } from './material-subtype/material-subtype.module';
import { MaterialTypeModule } from './material-type/material-type.module';
import { MaterialModule } from './material/material.module';
import { RequestDataModule } from './request-data/request-data.module';
import { RequestsModule } from './request/requests.module';
import { WarehouseFillingModule } from './warehouse-filling/warehouse-filling.module';

export const modules = [
  AuditLogModule,
  BackpackEmployeeModule,
  EmployeeModule,
  MaterialModule,
  MaterialCategoryModule,
  MaterialConsumptionModule,
  MaterialSubtypeModule,
  MaterialTypeModule,
  RequestsModule,
  RequestDataModule,
  WarehouseFillingModule,
];
