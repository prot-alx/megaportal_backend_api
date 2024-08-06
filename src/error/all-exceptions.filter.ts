import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

export class DetailedInternalServerErrorException extends HttpException {
  constructor(message: string, details?: any) {
    super({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message,
      details,
    }, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Если это ваше пользовательское исключение
    if (exception instanceof DetailedInternalServerErrorException) {
      response.status(status).json({
        statusCode: status,
        message: exception.getResponse()['message'], // Сообщение из исключения
        details: exception.getResponse()['details'], // Детали из исключения
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    } else {
      response.status(status).json({
        statusCode: status,
        message: (exception as any).message || 'Internal server error',
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }
  }
}
