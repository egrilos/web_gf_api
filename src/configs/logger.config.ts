import winston, { Logform } from "winston";
import chalk from "chalk";

// Define a custom format for handling Errors
const enumerateErrorFormat = winston.format(
  (info: Logform.TransformableInfo) => {
    if (info instanceof Error) {
      Object.assign(info, { message: info.stack });
    }
    return info;
  }
)();

// Create the logger
const logger = winston.createLogger({
  level: process.env.NODE_ENV === "development" ? "debug" : "info",
  format: winston.format.combine(
    enumerateErrorFormat,
    process.env.NODE_ENV === "development"
      ? winston.format.colorize()
      : winston.format.uncolorize(),
    winston.format.splat(),
    winston.format.printf(({ level, message }) => `${level}: ${message}`)
  ),
  transports: [
    new winston.transports.Console({
      stderrLevels: ["error"],
    }),
  ],
});

const modeLog = (mode: string): string => {
  switch (mode) {
    case "development":
      return chalk.underline.yellowBright(mode);
    case "production":
      return chalk.underline.greenBright(mode);
    default:
      return chalk.underline.yellow(mode);
  }
};

export { logger, modeLog };
// // To be used as logger.info(message) or logger.error(error)
