import winstonLb from "winston";
import moment from "moment";
import winston from "./winston";
import { errors } from "./constants/message";
import { http, message } from "./constants";

/** Define group log */
const logAttribute = {
  type: { info: "info", error: "error" },
};

const jsonSuccess = (result = null) => ({ success: true, result });

const jsonError = (err = null) => ({ success: false, error: err });

/** Config logger */
const configLogger = ({ data, type, message }) => {
  try {
    if (data && type) {
      const date = moment().format("YYYY-MM-DD");
      const filename = `${getEnv("PATH_LOG")}/${type}/${date}.log`;

      const fileLogger = winstonLb.createLogger({
        transports: [
          new winstonLb.transports.File({
            filename,
            colorize: true,
          }),
        ],
        exitOnError: false,
      });

      data = type === logAttribute.type.error ? { name: data, message } : data;
      fileLogger[type]({ time: moment(), data });
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const logger = {
  verbose: (message) => {
    if (getEnv("FULL_LOG") !== "true") return;
    return winston.verbose(message);
  },
  warn: (message) => {
    if (getEnv("FULL_LOG") !== "true") return;
    return winston.warn(message);
  },
  error: (message, error, attr) => {
    /** Write log */
    configLogger({ data: error, type: logAttribute.type.error, message });

    return winston.error(`${message}::${error}`);
  },
  info: (message, attr) => {
    try {
      /** Write log */
      configLogger({ data: attr, type: logAttribute.type.info, message });
      return winston.info(message);
    } catch (error) {
      throw error;
    }
  },
};

const handleLogger = (res, req, type, message = "", code = 200) => {
  const data = {
    type: "request",
    ipAddress: req.ip,
    time: new Date(),
    method: req.method,
    url: req.url,
    // referer: req.headers.referrer || req.headers.referer,
    userAgent: req.get("User-Agent"),
    statusCode: null,
    errorMessage: "",
  };

  if (type === "response") {
    data.type = "response";
    data.statusCode = code;
    data.errorMessage = message;
  }
  console.log(data);
};

const handleExceptionResponse = (req, res, errName, error) => {
  // Logger
  logger.error(`${new Date().toDateString()}_${errName}`, error);
  handleLogger(
    res,
    req,
    "response",
    message.errors.SYSTEM_ERROR.message,
    http.code.ERROR_EXCEPTION_CODE
  );
  return res
    .status(http.code.ERROR_EXCEPTION_CODE)
    .json(
      jsonError(message.errors.SYSTEM_ERROR, http.code.ERROR_EXCEPTION_CODE)
    );
};

const handleValidationFailResponse = (req, res, error, result = null) => {
  handleLogger(
    res,
    req,
    "response",
    error.message,
    http.code.VALIDATION_FAIL_CODE
  );
  return res
    .status(http.code.VALIDATION_FAIL_CODE)
    .json(jsonError(error, http.code.VALIDATION_FAIL_CODE, result));
};

const handleNotFoundDataResponse = (
  req,
  res,
  error = message.errors.NOT_FOUND_ERROR
) => {
  handleLogger(res, req, "response", error.message, http.code.NOT_FOUND_CODE);
  return res
    .status(http.code.NOT_FOUND_CODE)
    .json(jsonError(error, http.code.NOT_FOUND_CODE));
};

const handleSuccessResponse = (req, res, result = null) => {
  handleLogger(res, req, "response", null, http.code.SUCCESS_CODE);
  return res
    .status(http.code.SUCCESS_CODE)
    .json(jsonSuccess(result, http.code.SUCCESS_CODE));
};

const handleCreatedSuccessResponse = (req, res, result = null) => {
  handleLogger(res, req, "response", null, http.code.CREATED_SUCCESS_CODE);
  return res
    .status(http.code.CREATED_SUCCESS_CODE)
    .json(jsonSuccess(result, http.code.CREATED_SUCCESS_CODE));
};

const handleAuthFailResponse = (res) => {
  return res
    .status(http.code.AUTHENTICATION_FAIL_CODE)
    .json(
      jsonError(
        message.errors.NO_AUTHENTICATED_ERROR,
        http.code.AUTHENTICATION_FAIL_CODE
      )
    );
};

export {
  errors,
  jsonSuccess,
  jsonError,
  logger,
  handleExceptionResponse,
  handleValidationFailResponse,
  handleSuccessResponse,
  handleCreatedSuccessResponse,
  handleLogger,
  handleNotFoundDataResponse,
};
