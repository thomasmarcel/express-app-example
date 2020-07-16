import logger from "loglevel";
import { startServer } from "./start";

const convertLogLevel: (logLevel: string | undefined) => logger.LogLevelDesc = (
  logLevel: string | undefined,
) => {
  switch (logLevel) {
    case "1":
      return logger.levels.ERROR;
    case "2":
      return logger.levels.WARN;
    default:
      return logger.levels.INFO;
  }
};

const isTest = process.env.NODE_ENV === "test";
const logLevel: logger.LogLevelDesc = convertLogLevel(process.env.LOG_LEVEL) ||
  (isTest ? logger.levels.WARN : logger.levels.INFO);

logger.setLevel(logLevel);

startServer();
