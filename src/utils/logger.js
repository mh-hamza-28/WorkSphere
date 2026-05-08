import winston from "winston";

const { combine, timestamp, errors, json, colorize, printf } = winston.format;

const consoleFormat =
  process.env.NODE_ENV === "production"
    ? combine(timestamp(), errors({ stack: true }), json())
    : combine(
        colorize(),
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        errors({ stack: true }),
        printf(({ level, message, timestamp: time, stack, ...meta }) => {
          const extra = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
          return `${time} ${level}: ${stack || message}${extra}`;
        }),
      );

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  defaultMeta: { service: "worksphere-api" },
  transports: [new winston.transports.Console({ format: consoleFormat })],
});

export const morganStream = {
  write: (message) => logger.http(message.trim()),
};
