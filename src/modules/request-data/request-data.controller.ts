import {
  Controller,
  Post,
  Body,
  UseGuards,
  UnauthorizedException,
  Req,
  Get,
  Delete,
  Param,
  Patch,
} from '@nestjs/common';
import { Request } from 'express';
import { RequestDataService } from './request-data.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { ChangeRequestStatusDto, RequestDataDto } from './request-data.dto';
import { Requests } from '../request/requests.entity';
import { DetailedInternalServerErrorException } from 'src/error/all-exceptions.filter';

@Controller('request-data')
@UseGuards(AuthGuard('jwt'))
export class RequestDataController {
  constructor(
    private readonly requestDataService: RequestDataService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('assign')
  async assignRequest(
    @Body() assignRequestDto: RequestDataDto,
    @Req() req: Request,
  ) {
    try {
      const token = req.headers['authorization']?.split(' ')[1];
      if (!token) {
        throw new UnauthorizedException('Token is missing');
      }
      return await this.requestDataService.assignRequest(
        assignRequestDto.request_id,
        assignRequestDto.performer_id,
        token,
      );
    } catch (error) {
      throw new DetailedInternalServerErrorException(
        'Error assigning request',
        error.message,
      );
    }
  }

  @Get('/assigned')
  async getAssignedRequests(@Req() req: Request): Promise<Requests[]> {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        throw new UnauthorizedException('Token is missing');
      }
      return await this.requestDataService.getAssignedRequests(token);
    } catch (error) {
      throw new DetailedInternalServerErrorException(
        'Error retrieving assigned requests',
        error.message,
      );
    }
  }

  @Delete(':requestId/performer/:performerId')
  async removePerformer(
    @Param('requestId') requestId: number,
    @Param('performerId') performerId: number,
  ) {
    try {
      await this.requestDataService.removePerformer(requestId, performerId);
      return { message: 'Performer removed successfully' };
    } catch (error) {
      throw new DetailedInternalServerErrorException(
        'Error removing performer',
        error.message,
      );
    }
  }

  @Get()
  async findAll() {
    try {
      return await this.requestDataService.findAll();
    } catch (error) {
      throw new DetailedInternalServerErrorException(
        'Error retrieving all request data',
        error.message,
      );
    }
  }

  @Patch(':id/status')
  async changeRequestStatus(
    @Param('id') requestId: number,
    @Body() changeRequestStatusDto: ChangeRequestStatusDto,
    @Req() req: Request,
  ) {
    try {
      const token = req.headers['authorization']?.split(' ')[1];
      if (!token) {
        throw new UnauthorizedException('Token is missing');
      }
      return await this.requestDataService.changeRequestStatus(
        requestId,
        changeRequestStatusDto.status,
        token,
      );
    } catch (error) {
      throw new DetailedInternalServerErrorException(
        'Error changing request status',
        error.message,
      );
    }
  }
}
