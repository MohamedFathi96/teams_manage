export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type ApiError = {
  code?: string;
  details?: unknown;
};

export class ApiMeta {
  pagination?: PaginationMeta;
  [key: string]: unknown;
}

export type ApiResponse<T = unknown> = {
  success: boolean;
  data: T | null;
  message: string;
  error?: ApiError;
  statusCode: number;
  meta?: ApiMeta;
};

export type SuccessResponse<T = any> = ApiResponse<T> & {
  success: true;
  data: T;
};

export type ErrorResponse = ApiResponse<null> & {
  success: false;
  data: null;
  error: ApiError;
};

export class ApiResponseHelper {
  static success<T>(
    data: T,
    message: string = "Operation completed successfully",
    statusCode: number = 200,
    meta?: Record<string, unknown>
  ): SuccessResponse<T> {
    return {
      success: true,
      data,
      message,
      statusCode,
      meta,
    };
  }

  static error(
    message: string,
    statusCode: number = 500,
    errorCode?: string,
    errorDetails?: unknown,
    meta?: Record<string, unknown>
  ): ErrorResponse {
    return {
      success: false,
      data: null,
      message,
      error: {
        code: errorCode,
        details: errorDetails,
      },
      statusCode,
      meta,
    };
  }

  static paginated<T>(
    data: T,
    pagination: PaginationMeta,
    message: string = "Data retrieved successfully",
    statusCode: number = 200
  ): SuccessResponse<T> {
    return {
      success: true,
      data,
      message,
      statusCode,
      meta: {
        pagination,
      },
    };
  }
}
