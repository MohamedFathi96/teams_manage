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

export type SuccessResponse<T = unknown> = ApiResponse<T> & {
  success: true;
  data: T;
};

export type ErrorResponse = ApiResponse<null> & {
  success: false;
  data: null;
  error: ApiError;
};

export type ApiData<T extends ApiResponse> = T extends SuccessResponse<infer U> ? U : never;

export type PaginatedResponse<T> = SuccessResponse<T[]> & {
  meta: {
    pagination: PaginationMeta;
  };
};
