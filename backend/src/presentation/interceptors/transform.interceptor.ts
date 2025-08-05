import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request } from 'express';
import { ApiResponse } from '../../shared/types/api-response.type';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse();
    
    return next.handle().pipe(
      map(data => {
        // Skip transformation for redirects and non-JSON responses
        if (response.statusCode >= 300 && response.statusCode < 400) {
          return data;
        }

        // Skip transformation if data is already in API response format
        if (data && typeof data === 'object' && 'success' in data) {
          return data;
        }

        return {
          success: true,
          data,
          timestamp: new Date().toISOString(),
          path: request.url,
        } as ApiResponse;
      })
    );
  }
}