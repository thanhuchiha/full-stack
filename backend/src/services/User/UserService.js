import {
  handleExceptionResponse,
  handleSuccessResponse,
} from "../../utils/system";
import { UserRepository } from "../../repositories/User";

class UserService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async getUserInfo(req, res) {
    try {
      const user = req.body;
      return handleSuccessResponse(req, res, user);
    } catch (error) {
      return handleExceptionResponse(
        req,
        res,
        "ERRORS_GET_INFOR_USER_API",
        error
      );
    }
  }
}

export default new UserService();
