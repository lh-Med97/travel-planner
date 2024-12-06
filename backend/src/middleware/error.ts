import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error('Error:', {
    error: err,
    path: req.path,
    method: req.method,
    body: req.body,
    query: req.query,
    params: req.params,
  });

  // Handle Prisma errors
  if (err instanceof PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002': // Unique constraint failed
        return res.status(409).json({
          status: 'error',
          message: 'A record with this data already exists',
        });
      case 'P2025': // Record not found
        return res.status(404).json({
          status: 'error',
          message: 'Record not found',
        });
      default:
        return res.status(500).json({
          status: 'error',
          message: 'Database error occurred',
        });
    }
  }

  // Handle custom AppError
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid token',
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      status: 'error',
      message: 'Token expired',
    });
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      status: 'error',
      message: err.message,
    });
  }

  // Handle unknown errors
  return res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
};
