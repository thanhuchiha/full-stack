import UserService from "../../services/User/UserService";
import { authenticated } from "../../middleware/User/policies";
import express from "express";

const UserController = express.Router();
UserController.base = "users";

/**
 * GET /users/profile
 * @security BearerAuthUser
 * @return {object} 200 - Success Response Profile
 * @return {object} 401 - Authenticated Fail Response
 * @return {object} 404 - Not Found Response
 * @return {object} 500 - Internal Error Response
 */
UserController.get("/user-information", [authenticated()], async (req, res) => {
  UserService.getUserInfo(req, res);
});

export { UserController };
