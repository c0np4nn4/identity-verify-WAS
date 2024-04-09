import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { CustomErrorException } from './custom-error.exception';

@Catch(CustomErrorException)
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: CustomErrorException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(exception.getStatus()).json({
      statusCode: exception.getStatus(),
      data: { message: exception.getResponse() },
    });
  }
}
