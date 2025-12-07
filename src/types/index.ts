export interface HealthStatus {
  status: "ok" | "error";
  timestamp: string;
  service: string;
  uptime?: number;
  memory?: NodeJS.MemoryUsage;
  version?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export * from './errors';

// Import the error classes for the helper functions
import { ValidationError, NotFoundError, UnauthorizedError, ForbiddenError, ConflictError } from './errors';

// Helper functions for common error scenarios
export const throwValidationError = (message: string) => {
  throw new ValidationError(message);
};

export const throwNotFoundError = (resource: string = 'Resource') => {
  throw new NotFoundError(`${resource} not found`);
};

export const throwUnauthorizedError = (message?: string) => {
  throw new UnauthorizedError(message);
};

export const throwForbiddenError = (message?: string) => {
  throw new ForbiddenError(message);
};

export const throwConflictError = (resource: string = 'Resource') => {
  throw new ConflictError(`${resource} already exists`);
};
