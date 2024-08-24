import { validationResult } from 'express-validator';
import { handleValidationFailResponse } from '../utils/system';

class Validator {
    /**
     * Express validator middleware
     */
    static check() {
        return (req, res, next) => {
            const errors = validationResult(req);

            if (errors.isEmpty()) {
                return next();
            }

            const errorMsg = errors.array()[0].msg;

            return handleValidationFailResponse(req, res, errorMsg);
        };
    }
}

export { Validator };
