import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes';
import prisma from './config/database';
import { errorHandler } from './middleware/error';
import { logger, httpLogger } from './utils/logger';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(httpLogger); // Add HTTP request logging

// Routes
app.use('/api', routes);

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Test database connection
    await prisma.$connect();
    logger.info('✅ Database connected successfully');

    app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  logger.error('Unhandled Rejection:', error);
  process.exit(1);
});

startServer();
