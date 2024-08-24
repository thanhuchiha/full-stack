import { logger, handleExceptionResponse, jsonError, handleLogger } from '../utils/system';
import { textAttrs } from '../core/boot';

const requestLogger = () => (req, res, next) => {
    handleLogger(res, req, 'request');
    if (['GET', 'POST', 'PUT', 'DELETE'].indexOf(req.method) >= 0) logger.verbose(req.url, req.body);
    next();
};

/** Check max length string attributes 255 of body */
const checkMaxLengthBody = () => (req, res, next) => {
    try {
        if (req.body) {
            const keys = Object.keys(req.body);
            for (let i = 0; i < keys.length; i++) {
                if (!textAttrs.includes(keys[i]) && req.body[keys[i]] && req.body[keys[i]].length > 255) {
                    return res.json(jsonError({ code: `${keys[i].toUpperCase()}_MAX_255_ERROR` }));
                }
            }
        }
        return next();
    } catch (error) {
        handleExceptionResponse(req, res, 'ERRORS_CHECK_MAX_LENGTH_BODY_MIDDLEWARE', error);
    }
};

const regulators = [requestLogger(), checkMaxLengthBody()];

export { regulators };
