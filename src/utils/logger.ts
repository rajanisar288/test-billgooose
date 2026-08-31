import pino from 'pino';

// Create logger instance
export const logger = pino({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  transport:
    process.env.NODE_ENV !== 'production'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
          },
        }
      : undefined,
  base: {
    env: process.env.NODE_ENV || 'development',
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

// For browser console logging (optional wrapper)
export const log = {
  info: (message: string, data?: any) => {
    if (typeof window === 'undefined') {
      logger.info(data || {}, message);
    } else {
      console.log(`[INFO] ${message}`, data || '');
    }
  },
  error: (message: string, error?: any) => {
    if (typeof window === 'undefined') {
      logger.error(error || {}, message);
    } else {
      console.error(error || '');
    }
  },
  warn: (message: string, data?: any) => {
    if (typeof window === 'undefined') {
      logger.warn(data || {}, message);
    } else {
      console.warn(`[WARN] ${message}`, data || '');
    }
  },
  debug: (message: string, data?: any) => {
    if (typeof window === 'undefined') {
      logger.debug(data || {}, message);
    } else {
      console.debug(`[DEBUG] ${message}`, data || '');
    }
  },
};

// For logging API requests specifically
export const apiLogger = {
  request: (method: string, url: string, data?: any) => {
    log.debug(`API Request: ${method} ${url}`, { data });
  },
  response: (method: string, url: string, status: number, data?: any) => {
    log.info(`API Response: ${method} ${url} - ${status}`, { data });
  },
  error: (method: string, url: string, error: any) => {
    log.error(`API Error: ${method} ${url}`, error);
  },
};

export default logger;
