import AuthService from "../../services/User/AuthService";
import {
  isExistedUser,
  isEmailAvailable,
  verifyCode,
  isEmailResend,
} from "../../middleware/User/policies";
import {
  emailValidator,
  signInValidator,
  signUpValidator,
  refreshTokenValidator,
} from "../../validations/api";
import { ResendLimiter } from "../../core/limitRequest";

const AuthController = require("express").Router();
AuthController.base = "auth";

/**
 * @description Sign-up
 * @param {String} email
 * @param {String} password
 * @param {String} name
 * @param {String} phone
 * @param {String} address
 */
AuthController.post(
  "/sign-up",
  [signUpValidator, isEmailAvailable()],
  async (req, res) => {
    AuthService.signUp(req, res, req.body);
  }
);

/**
 * @description verification email
 * @param {String} token
 */
AuthController.get("/verification-email", [verifyCode()], async (req, res) => {
  AuthService.verificationEmail(req, res, req.body);
});

/**
 * @description resend verification with email or username and password
 * @param {String} email
 */
AuthController.post(
  "/resend-verification-email",
  [ResendLimiter, emailValidator, isEmailResend()],
  async (req, res) => {
    AuthService.resendVerificationEmail(req, res, req.body);
  }
);

/**
 * @description Sign-in with email or username and password
 * @param {String} email
 * @param {String} password
 */
AuthController.post(
  "/sign-in",
  [signInValidator, isExistedUser()],
  async (req, res) => {
    AuthService.signIn(req, res, req.body);
  }
);

/**
 * @description Get access-token from refresh-token
 * @param {String} refresh-token
 */
AuthController.put(
  "/refresh-token",
  [refreshTokenValidator],
  async (req, res) => {
    AuthService.getAccessToken(req, res, req.body);
  }
);

export { AuthController };
