import rateLimit from 'express-rate-limit';

const Limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minutes
    max: 300, // limit each IP to 300 requests per windowMs
    message: `Too many request from this IP, please try again after`
});

const ResendLimiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000, // 1 day
    max: 2, // limit each IP to 2 requests per windowMs
    message: `Too many request to resend verification email from this IP, please try again after`,
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

export {Limiter, ResendLimiter};
