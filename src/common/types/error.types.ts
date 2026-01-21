export interface TErrorSource {
  field: string | number;
  message: string;
  code?: string;
}

export interface TSimplifiedError {
  statusCode: number;
  message: string;
  errorType: string;
  isOperational: boolean;
  errorSources: TErrorSource[];
}

export interface TErrorResponse {
  success: false;
  message: string;
  errorType: string;
  errors: TErrorSource[];
  stack?: string;
  requestId?: string;
  timestamp?: string;
}

export enum ErrorSeverity {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical",
}

export enum ErrorCategory {
  DATABASE = "database",
  VALIDATION = "validation",
  AUTHENTICATION = "authentication",
  AUTHORIZATION = "authorization",
  CACHE = "cache",
  EXTERNAL_API = "external_api",
  FILE_SYSTEM = "file_system",
  BUSINESS_LOGIC = "business_logic",
  UNKNOWN = "unknown",
}
