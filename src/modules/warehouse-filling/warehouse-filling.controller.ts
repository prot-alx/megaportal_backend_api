import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Headers,
  UseGuards,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { WarehouseFillingService } from './warehouse-filling.service';
import { WarehouseFilling } from './warehouse-filling.entity';
import {
  AddOrRemoveQuantityDto,
  CreateWarehouseFillingDto,
  WarehouseMaterialDto,
} from './warehouse-filling.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { DetailedInternalServerErrorException } from 'src/error/all-exceptions.filter';

@ApiTags('Warehouse Stock')
@ApiBearerAuth()
@Controller('warehouse-filling')
@UseGuards(AuthGuard('jwt'))
export class WarehouseFillingController {
  constructor(
    private readonly warehouseFillingService: WarehouseFillingService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new warehouse filling record' })
  @ApiResponse({
    status: 201,
    description: 'The warehouse filling record has been successfully created.',
    type: WarehouseFilling,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized, token is missing or invalid.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error, an unexpected error occurred.',
  })
  async create(
    @Body() createWarehouseFillingDto: CreateWarehouseFillingDto,
    @Headers('authorization') authHeader: string,
  ): Promise<WarehouseFilling> {
    try {
      const token = authHeader?.split(' ')[1]; // Extract token from Bearer
      if (!token) {
        throw new UnauthorizedException('Token is missing');
      }
      return this.warehouseFillingService.create(
        createWarehouseFillingDto,
        token,
      );
    } catch (error) {
      throw new DetailedInternalServerErrorException(
        'Error creating warehouse filling record',
        error.message,
      );
    }
  }

  @Put(':id/add')
  @ApiOperation({
    summary: 'Add quantity to an existing warehouse filling record',
  })
  @ApiResponse({
    status: 200,
    description:
      'Quantity has been successfully added to the warehouse filling record.',
    type: WarehouseFilling,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request, invalid quantity provided.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized, token is missing or invalid.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error, an unexpected error occurred.',
  })
  async addQuantity(
    @Param('id') id: number,
    @Body() addOrRemoveQuantityDto: AddOrRemoveQuantityDto, // Используйте DTO
    @Headers('authorization') authHeader: string,
  ): Promise<WarehouseFilling> {
    try {
      const { count } = addOrRemoveQuantityDto; // Извлеките значение из DTO

      if (isNaN(count) || count < 0) {
        throw new BadRequestException('Count must be a non-negative number');
      }

      const token = authHeader?.split(' ')[1]; // Extract token from Bearer
      if (!token) {
        throw new UnauthorizedException('Token is missing');
      }

      return this.warehouseFillingService.addQuantity(id, count, token);
    } catch (error) {
      throw new DetailedInternalServerErrorException(
        'Error adding quantity to warehouse filling record',
        error.message,
      );
    }
  }

  @Put(':id/remove')
  @ApiOperation({
    summary: 'Remove quantity from an existing warehouse filling record',
  })
  @ApiResponse({
    status: 200,
    description:
      'Quantity has been successfully removed from the warehouse filling record.',
    type: WarehouseFilling,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request, invalid quantity provided.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized, token is missing or invalid.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error, an unexpected error occurred.',
  })
  async removeQuantity(
    @Param('id') id: number,
    @Body() addOrRemoveQuantityDto: AddOrRemoveQuantityDto,
    @Headers('authorization') authHeader: string,
  ): Promise<WarehouseFilling> {
    try {
      const { count } = addOrRemoveQuantityDto;

      if (isNaN(count) || count <= 0) {
        throw new BadRequestException('Count must be a positive number');
      }

      const token = authHeader?.split(' ')[1];
      if (!token) {
        throw new UnauthorizedException('Token is missing');
      }

      return this.warehouseFillingService.removeQuantity(id, count, token);
    } catch (error) {
      throw new DetailedInternalServerErrorException(
        'Error removing quantity from warehouse filling record',
        error.message,
      );
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all warehouse materials' })
  @ApiResponse({
    status: 200,
    description: 'List of all warehouse materials.',
    type: [WarehouseMaterialDto],
  })
  async getWarehouseMaterials(): Promise<WarehouseMaterialDto[]> {
    return this.warehouseFillingService.getAllWarehouseMaterials();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a warehouse material by its ID' })
  @ApiResponse({
    status: 200,
    description: 'The warehouse material has been successfully retrieved.',
    type: WarehouseMaterialDto,
  })
  @ApiResponse({
    status: 404,
    description:
      'Not found, the warehouse material with the given ID does not exist.',
  })
  async getWarehouseMaterial(
    @Param('id') id: number,
  ): Promise<WarehouseMaterialDto> {
    return this.warehouseFillingService.getWarehouseMaterialById(id);
  }
}
