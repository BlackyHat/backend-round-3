class AppError extends Error {
  status: number;
  success: boolean;
  error: string;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.success = false;
    this.error = message;
  }
}
class BadRequestError extends AppError {
  constructor(message: string) {
    super(400, message);
  }
}
class NotAuthorizedError extends AppError {
  constructor(message: string) {
    super(401, message);
  }
}
class NotFoundError extends AppError {
  constructor(message: string) {
    super(404, message);
  }
}
class ConflictError extends AppError {
  constructor(message: string) {
    super(409, message);
  }
}

export {
  AppError,
  BadRequestError,
  NotAuthorizedError,
  ConflictError,
  NotFoundError,
};
