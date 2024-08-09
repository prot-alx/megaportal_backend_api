import {
  Controller,
  Post,
  Body,
  UseGuards,
  UnauthorizedException,
  Req,
  Get,
} from '@nestjs/common';
import { RequestDataService } from './request-data.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { RequestDataDto } from './request-data.dto';

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
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Token is missing');
    }
    return this.requestDataService.assignRequest(
      assignRequestDto.request_id,
      assignRequestDto.performer_id,
      token,
    );
  }

  @Get()
  async findAll() {
    return this.requestDataService.findAll();
  }
}
