import { AuditLog } from "./audit-log/audit-log.entity";
import { BackpackEmployee } from "./backpack-employee/backpack-employee.entity";
import { Employee } from "./employee/employee.entity";
import { Material } from "./material/material.entity";
import { MaterialCategory } from "./material-category/material-category.entity";
import { MaterialConsumption } from "./material-consumption/material-consumption.entity";
import { MaterialSubtype } from "./material-subtype/material-subtype.entity";
import { MaterialType } from "./material-type/material-type.entity";
import { Requests } from "./request/requests.entity";
import { RequestData } from "./request-data/request-data.entity";
import { WarehouseFilling } from "./warehouse-filling/warehouse-filling.entity";

export const entities = [
  AuditLog,
  BackpackEmployee,
  Employee,
  Material,
  MaterialCategory,
  MaterialConsumption,
  MaterialSubtype,
  MaterialType,
  Requests,
  RequestData,
  WarehouseFilling,
]