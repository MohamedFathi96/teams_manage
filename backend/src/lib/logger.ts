import { createLogger, format, transports } from "winston";
import { config } from "../config/index";

const { combine, timestamp, printf, colorize, errors, splat } = format;

const logFormat = printf(({ level, message, timestamp, stack, ...meta }) => {
  const metaString = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : "";
  return `${timestamp} ${level}: ${stack || message}${metaString}`;
});

export const logger = createLogger({
  level: config.isDev ? "debug" : "info",
  format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }), errors({ stack: true }), splat(), logFormat),
  transports: [
    new transports.Console({
      format: combine(colorize({ all: true }), logFormat),
    }),
  ],
});
