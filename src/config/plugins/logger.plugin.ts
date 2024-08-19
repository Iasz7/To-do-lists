import winston from 'winston';
const {json, combine, timestamp, align, printf} =winston.format;

export const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
      format: combine(
    // colorize({ all: true }),
    timestamp({
      format: 'YYYY-MM-DD hh:mm:ss.SSS A',
    }),
    align(),
    printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`),
    // json()
  ),
//   defaultMeta: { service: 'user-service' },
  transports: [
    //
    // - Write all logs with importance level of `error` or less to `error.log`
    // - Write all logs with importance level of `info` or less to `combined.log`
    //
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
      format: winston.format.simple(),
    }));
  }

export default function buildLogger(service: string) {
    return {
        log:(message: string) => logger.log('info', {message, service}),
        error:(message: string) => logger.log('error', {message, service})
    }
};