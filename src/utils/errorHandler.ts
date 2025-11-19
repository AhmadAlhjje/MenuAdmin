import { AxiosError } from 'axios';

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    // Handle API error response
    if (error.response?.data?.message) {
      return error.response.data.message;
    }

    // Handle HTTP status codes
    switch (error.response?.status) {
      case 400:
        return 'Invalid request data';
      case 401:
        return 'Unauthorized access';
      case 403:
        return 'Access forbidden';
      case 404:
        return 'Resource not found';
      case 409:
        return 'Resource already exists';
      case 422:
        return 'Validation error';
      case 500:
        return 'Internal server error';
      default:
        return error.message || 'An error occurred';
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unknown error occurred';
};

export const formatErrorResponse = (error: unknown) => {
  return {
    message: getErrorMessage(error),
    error: error instanceof Error ? error : null,
  };
};
