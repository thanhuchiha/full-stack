import { body } from 'express-validator';
import { message, regex } from '../../utils/constants';

const commoneRule = {
    email: field =>
        body(field)
            .trim()
            .not()
            .isEmpty()
            .withMessage(message.errors.REQUIRED_EMAIL)
            .isLength({ max: 255 })
            .withMessage(message.errors.INVALID_EMAIL)
            .matches(regex.rule.EMAIL)
            .withMessage(message.errors.INVALID_EMAIL),
    password: field =>
        body(field)
            .trim()
            .not()
            .isEmpty()
            .withMessage(message.errors.PASSWORD_REQUIRED)
            .isLength({ min: 6 })
            .withMessage(message.errors.PASSWORD_MIN_LENGTH_6_ERROR)
            .isLength({ max: 255 })
            .withMessage(message.errors.PASSWORD_MAX_255_ERROR)
};
export default commoneRule;
