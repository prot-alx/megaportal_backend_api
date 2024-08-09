import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  UnauthorizedException,
  HttpCode,
} from '@nestjs/common';
import { RequestsService } from './requests.service';
import { CreateRequestDto } from './request.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('requests')
@UseGuards(AuthGuard('jwt'))
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Post()
  @HttpCode(201)
  async create(
    @Body() createRequestDto: CreateRequestDto,
    @Req() req: Request,
  ) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Token is missing');
    }
    return this.requestsService.create(createRequestDto, token);
  }

  @Get('me')
  async getCurrentUser(@Req() req: Request) {
    const token = req.headers['authorization'].split(' ')[1];
    return this.requestsService.getCurrentUser(token);
  }

  @Get()
  async findAll() {
    return this.requestsService.findAll();
  }
}
