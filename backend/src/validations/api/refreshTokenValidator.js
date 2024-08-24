import { body } from 'express-validator';
import { Validator } from "../validator";
import { message } from "../../utils/constants";

export default [
  body("refresh")
    .trim()
    .not()
    .isEmpty()
    .withMessage(message.errors.REFRESH_TOKEN_REQUIRED),
  Validator.check(),
];
