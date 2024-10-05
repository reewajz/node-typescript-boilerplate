import colors from 'chalk';
import winston from 'winston';
const { combine, printf } = winston.format;

/**
 * Custom log format function.
 *
 * @param level - The log level.
 * @param message - The log message.
 * @param service - The service name.
 * @param batchId - The batch ID.
 * @returns The formatted log message as a JSON string.
 */
const myFormat = printf(({ level, message, service, batchId }) => {
  let jsonString = `{ "message": "${level === 'error' ? colors.red(message) : colors.gray(message)}"`;
  if (batchId) {
    jsonString += `, "batchId": "${colors.green(batchId)}"`;
  }
  jsonString += `, "level": "${level}", "service": "${colors.yellow(service)}" }`;
  return jsonString;
});

/**
 * Creates a logger instance with the specified service name.
 * @param service - The name of the service.
 * @returns A winston.Logger instance.
 */
export function createLogger(service: string): winston.Logger {
  return winston.createLogger({
    defaultMeta: {
      service,
    },
    format: combine(myFormat),
    transports: [new winston.transports.Console()],
  });
}

// Create a default logger instance for the 'etl-state-manager' service
const logger = createLogger('etl-state-manager');

export default logger;
