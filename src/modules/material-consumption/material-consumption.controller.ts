import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Headers,
  HttpException,
  Query,
  HttpStatus,
  Patch,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { MaterialConsumptionService } from './material-consumption.service';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DetailedInternalServerErrorException } from 'src/error/all-exceptions.filter';
import {
  CreateMaterialConsumptionDto,
  MaterialConsumptionResponseDto,
} from './material-consumption.dto';

@ApiTags('Material Consumption')
@ApiBearerAuth()
@Controller('material-consumption')
@UseGuards(AuthGuard('jwt'))
export class MaterialConsumptionController {
  constructor(
    private readonly materialConsumptionService: MaterialConsumptionService,
  ) {}

  @Post('use')
  @ApiOperation({ summary: 'Использовать материал по заявке' })
  @ApiBody({
    description: 'Информация для использования материала',
    type: CreateMaterialConsumptionDto,
  })
  @ApiResponse({ status: 200, description: 'Материал успешно использован' })
  @ApiResponse({ status: 400, description: 'Некорректные данные запроса' })
  async useMaterialOnRequest(
    @Headers('authorization') authHeader: string,
    @Body('request_data_id') requestDataId: number,
    @Body('backpack_employee_id') backpackEmployeeId: number,
    @Body('count') count: number,
  ): Promise<{ message: string }> {
    const token = authHeader.split(' ')[1]; // Извлечение токена из заголовка Authorization

    return await this.materialConsumptionService.useMaterialOnRequest(
      token,
      requestDataId,
      backpackEmployeeId,
      count,
    );
  }

  @Get('/all')
  @ApiOperation({ summary: 'Получить все расходы материала' })
  @ApiResponse({
    status: 200,
    description: 'Список всех расходов материала',
    type: [MaterialConsumptionResponseDto],
  })
  @ApiResponse({
    status: 500,
    description: 'Ошибка при получении всех расходов материала',
  })
  async getAllMaterialConsumptions(@Req() req: Request) {
    try {
      return await this.materialConsumptionService.getAllMaterialConsumptions();
    } catch (error) {
      throw new DetailedInternalServerErrorException(
        'Error retrieving all material consumptions',
        error.message,
      );
    }
  }

  @Get('approved')
  @ApiOperation({ summary: 'Получить расходы материала по статусу одобрения' })
  @ApiQuery({
    name: 'approved',
    type: String,
    required: false,
    description: 'Статус одобрения материала',
  })
  @ApiResponse({
    status: 200,
    description: 'Список расходов материала по статусу одобрения',
    type: [MaterialConsumptionResponseDto],
  })
  @ApiResponse({
    status: 400,
    description: 'Некорректное значение параметра approved',
  })
  @ApiResponse({
    status: 500,
    description: 'Ошибка при получении расходов материала по статусу одобрения',
  })
  async getMaterialConsumptionsByApproval(
    @Query('approved') approved: string,
  ): Promise<MaterialConsumptionResponseDto[]> {
    try {
      // Преобразуем строку в булевый тип
      const isApproved = approved === 'true';
      if (isApproved === null) {
        throw new HttpException(
          'Invalid value for approved parameter',
          HttpStatus.BAD_REQUEST,
        );
      }
      return await this.materialConsumptionService.getMaterialConsumptionsByApproval(
        isApproved,
      );
    } catch (error) {
      throw new HttpException(
        'Error retrieving material consumptions by approval status',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @Patch(':id/approve')
  @ApiOperation({ summary: 'Approve material consumption' })
  @ApiResponse({
    status: 200,
    description: 'Material consumption approved successfully.',
    type: MaterialConsumptionResponseDto, // Указываем тип ответа, если есть
  })
  @ApiResponse({ status: 404, description: 'Material consumption not found.' })
  @ApiResponse({
    status: 400,
    description: 'Material consumption is already approved.',
  })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async approveMaterialConsumption(
    @Param('id') id: number,
    @Headers('authorization') authHeader: string,
  ): Promise<MaterialConsumptionResponseDto> {
    if (!authHeader) {
      throw new BadRequestException('Authorization header is missing');
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new BadRequestException(
        'Token is missing from Authorization header',
      );
    }
    try {
      const materialConsumption =
        await this.materialConsumptionService.approveMaterialConsumption(
          id,
          token,
        );
      return new MaterialConsumptionResponseDto(materialConsumption);
    } catch (error) {
      console.error('Error in approveMaterialConsumption controller:', error);
      throw error;
    }
  }
}
