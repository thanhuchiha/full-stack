import {
  jsonError,
  logger,
  handleExceptionResponse,
  handleSuccessResponse,
  handleCreatedSuccessResponse,
} from "../../utils/system";
import { errors } from "../../utils/constants/message";
import { Jwt } from "../../utils/jwt";
import { comparePassword } from "../../utils/helper/encryption";
import { UserRepository } from "../../repositories/User";
import { encryptionHelper, stringHelper } from "../../utils/helper";
import { USER_STATUS } from "../../models/schema/User";
import { prefix } from "../../utils/constants/prefix";
class AuthService {
  constructor() {}

  async signUp(req, res, { email, password, name, phone, address }) {
    try {
      const userRepository = new UserRepository();
      const passwordEnc = await encryptionHelper.hashPassword(password);
      const userCount = await userRepository.count();
      const uid = stringHelper.generateId(userCount + 1, prefix.UID, 5);
      await userRepository.create({
        email,
        password: passwordEnc,
        active: USER_STATUS.NOT_ACTIVED,
        uid,
        name,
        phone,
        address,
      });

      const result = await userRepository.getOne(
        {
          email,
        },
        {
          attributes: ["id", "uid", "email", "created_at"],
        }
      );

      // TODO
      // Send a link to email to verify
      const verifyToken = await Jwt.sign(
        {
          email,
          uid,
        },
        "2h"
      );

      setTimeout(() => {
        logger.warn(
          "VERIFICATION URL: " +
            `http://127.0.0.1:3001/user/verification-email?token=` +
            verifyToken
        );
      }, 2000);

      return handleCreatedSuccessResponse(req, res, result);
    } catch (error) {
      return handleExceptionResponse(req, res, "ERRORS_SIGN_UP_API", error);
    }
  }

  async verificationEmail(req, res, { user }) {
    try {
      const userRepository = new UserRepository();

      await userRepository.updateOne(
        {
          email: user.email,
        },
        {
          active: USER_STATUS.ACTIVED,
        }
      );

      return handleSuccessResponse(req, res, { verification: true });
    } catch (error) {
      return handleExceptionResponse(
        req,
        res,
        "ERRORS_VERIFICATION_EMAIL_API",
        error
      );
    }
  }

  async resendVerificationEmail(req, res, { user }) {
    try {
      // TODO
      // Send a link to email to verify
      const token = await Jwt.sign(
        {
          email: user.email,
          uid: user.uid,
        },
        "2h"
      );
      setTimeout(() => {
        logger.warn(
          "LINK: " +
            `http://127.0.0.1:3001/user/verification-email?token=` +
            token
        );
      }, 2000);

      const payload = {
        id: user.id,
        uid: user.uid,
        email: user.email,
      };
      return handleCreatedSuccessResponse(req, res, { user: payload });
    } catch (error) {
      return handleExceptionResponse(
        req,
        res,
        "ERRORS_RESEND_VERIFICATION_EMAIL_API",
        error
      );
    }
  }

  async signIn(req, res, { password, user }) {
    try {
      const checkPassword = await comparePassword(password, user.password);
      if (!checkPassword) {
        return jsonError(errors.PASSWORD_WRONG);
      }

      const payload = {
        id: user.id,
        uid: user.uid,
        email: user.email,
      };
      const accessToken = await Jwt.sign(payload);
      const refreshToken = await Jwt.signRefreshToken(payload);

      return handleSuccessResponse(req, res, {
        access_token: accessToken,
        refresh_token: refreshToken,
      });
    } catch (error) {
      return handleExceptionResponse(req, res, "ERRORS_SIGN_IN_API", error);
    }
  }

  async getAccessToken(req, res, { refresh }) {
    try {
      const decoded = await Jwt.verifyRefreshToken(refresh);
      if (!decoded.success) {
        return res.json(decoded);
      }

      const payload = {
        id: decoded.id,
        uid: decoded.uid,
        email: decoded.email,
      };
      const accessToken = await Jwt.sign(payload);

      return handleSuccessResponse(req, res, {
        access_token: accessToken,
      });
    } catch (error) {
      return handleExceptionResponse(
        req,
        res,
        "ERRORS_REFRESH_TOKEN_API",
        error
      );
    }
  }
}

export default new AuthService();
