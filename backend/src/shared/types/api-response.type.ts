export interface ApiSuccessResponse<T = any> {
  success: true;
  data: T;
  timestamp: string;
  path: string;
  traceId?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
  timestamp: string;
  path: string;
  traceId?: string;
}

export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;