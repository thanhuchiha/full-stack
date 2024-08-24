import {
  jsonError,
  handleExceptionResponse,
  handleValidationFailResponse,
  handleNotFoundDataResponse,
} from "../../utils/system";
import { errors } from "../../utils/constants/message";
import { USER_STATUS } from "../../models/schema/User";
import { Jwt } from "../../utils/jwt";
import { UserRepository } from "../../repositories/User";
import { message } from "../../utils/constants";
import { encryptionHelper } from "../../utils/helper";

export const isEmailAvailable = () => async (req, res, next) => {
  try {
    const userRepository = new UserRepository();
    const { email } = req.body;
    if (email) {
      const user = await userRepository.getByEmail(email);
      if (user) {
        return handleValidationFailResponse(
          req,
          res,
          message.errors.EMAIL_ALREADY_EXISTS
        );
      }
    }
    return next();
  } catch (error) {
    return handleExceptionResponse(
      req,
      res,
      "ERRORS_USER_EMAIL_AVAILABLE_MIDDLEWARE",
      error
    );
  }
};

export const verifyCode = () => async (req, res, next) => {
  try {
    const userRepository = new UserRepository();
    const { token } = req.query;
    if (!token) {
      return handleValidationFailResponse(
        req,
        res,
        message.errors.TOKEN_REQUIRED
      );
    }
    const decoded = await Jwt.decode(token);
    if (decoded && decoded.result) {
      const { email } = decoded.result;
      const user = await userRepository.getByEmail(email);
      if (!user) {
        return handleValidationFailResponse(
          req,
          res,
          message.errors.EMAIL_NOT_EXISTS
        );
      }
      if (user.active === USER_STATUS.ACTIVED) {
        return handleValidationFailResponse(
          req,
          res,
          message.errors.ACCOUNT_ALREADY_ACTIVED
        );
      }
      req.body.user = user;
    } else {
      return handleValidationFailResponse(
        req,
        res,
        message.errors.TOKEN_EXPIRED_ERROR
      );
    }
    return next();
  } catch (error) {
    return handleExceptionResponse(
      req,
      res,
      "ERRORS_USER_EMAIL_EXIST_MIDDLEWARE",
      error
    );
  }
};

export const isExistedUser = () => async (req, res, next) => {
  try {
    const userRepository = new UserRepository();
    const { email, password } = req.body;

    const user = await userRepository.getByEmail(email);
    if (!user) {
      return handleValidationFailResponse(
        req,
        res,
        message.errors.USER_NOT_EXISTS
      );
    }

    if (user.active === USER_STATUS.NOT_ACTIVED) {
      return handleValidationFailResponse(
        req,
        res,
        message.errors.ACCOUNT_NEED_ACTIVED
      );
    }

    const checkPassword = await encryptionHelper.comparePassword(
      password,
      user.password
    );
    if (!checkPassword) {
      return handleValidationFailResponse(
        req,
        res,
        message.errors.INCORRECT_PASSWORD
      );
    }
    // hide password
    req.body.user = user;
    return next();
  } catch (error) {
    handleExceptionResponse(
      req,
      res,
      "ERRORS_USER_POLICIES_EXISTED_USER_MIDDLEWARE",
      error
    );
  }
};

export const isEmailResend = () => async (req, res, next) => {
  try {
    const userRepository = new UserRepository();
    const { email } = req.body;
    if (email) {
      const user = await userRepository.getByEmail(email);
      if (!user) {
        return handleNotFoundDataResponse(
          req,
          res,
          message.errors.EMAIL_VERIFICATION_NOT_EXISTS
        );
      }
      if (user.active === USER_STATUS.ACTIVED) {
        return handleValidationFailResponse(
          req,
          res,
          message.errors.ACCOUNT_ALREADY_ACTIVED
        );
      }
      req.body.user = user;
    }
    return next();
  } catch (error) {
    return handleExceptionResponse(
      req,
      res,
      "ERRORS_USER_IS_EMAIL_RESEND_MIDDLEWARE",
      error
    );
  }
};

export const authenticated = () => async (req, res, next) => {
  try {
    const userRepository = new UserRepository();
    const authorization = req.header("Authorization");

    if (!authorization) {
      return res.json(jsonError(errors.NOT_AUTHENTICATED_ERROR));
    }

    // Decode token
    const decoded = await Jwt.verify(authorization);
    if (!decoded.success) {
      return res.json(decoded);
    }

    const user = await userRepository.getById(decoded.result.id, {
      exclude: ["password", "active"],
    });
    if (!user) {
      return res.json(jsonError(errors.NOT_AUTHENTICATED_ERROR));
    }

    req.body.user = user;

    return next();
  } catch (error) {
    handleExceptionResponse(
      req,
      res,
      "ERRORS_USER_POLICIES_AUTHENTICATED_MIDDLEWARE",
      error
    );
  }
};
