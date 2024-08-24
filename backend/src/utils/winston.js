import winston from "winston";
import path from "path";

const options = {
  file: {
    level: "info",
    format: winston.format.simple(),
    filename: path.join(__dirname, "../../mylogs/app.log"),
    json: true,
    colorize: false,
  },
  console: {
    level: "verbose",
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
    json: false,
    colorize: true,
  },
};

const logger = winston.createLogger({
  transports: [new winston.transports.Console(options.console)],
  exitOnError: false,
});
logger.morganStream = {
  write(message) {
    logger.info(message.substring(0, message.lastIndexOf("\n")));
  },
};

export default logger;
