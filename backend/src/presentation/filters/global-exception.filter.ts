import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { BaseException } from '../../shared/exceptions/base.exception';
import { ValidationException } from '../../shared/exceptions/application.exception';
import { ApiResponse } from '../../shared/types/api-response.type';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const { status, code, message, details } = this.parseException(exception);

    // Log error with appropriate level
    if (status >= 500) {
      this.logger.error(
        `${request.method} ${request.url} - ${status} - ${message}`,
        exception instanceof Error ? exception.stack : undefined,
      );
    } else {
      this.logger.warn(
        `${request.method} ${request.url} - ${status} - ${message}`,
        { details }
      );
    }

    const errorResponse: ApiResponse = {
      success: false,
      error: {
        code,
        message,
        details,
      },
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(status).json(errorResponse);
  }

  private parseException(exception: unknown) {
    if (exception instanceof BaseException) {
      return {
        status: exception.statusCode,
        code: exception.code,
        message: exception.message,
        details: exception.context,
      };
    }

    if (exception instanceof ValidationException) {
      return {
        status: exception.statusCode,
        code: exception.code,
        message: exception.message,
        details: exception.context,
      };
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const response = exception.getResponse();
      
      return {
        status,
        code: 'HTTP_EXCEPTION',
        message: typeof response === 'string' ? response : (response as any).message,
        details: typeof response === 'object' ? response : undefined,
      };
    }

    // Unknown exception
    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Internal server error',
      details: process.env.NODE_ENV === 'development' 
        ? { originalError: exception instanceof Error ? exception.message : String(exception) }
        : undefined,
    };
  }
}