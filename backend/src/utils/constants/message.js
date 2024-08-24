export const errors = {
    // -- SYSTEM errors
    ENV_NOT_SET_ERROR: { message: 'ENV_NOT_SET_ERROR' },
    SERVER_SHUTTING_DOWN: { message: 'SERVER_SHUTTING_DOWN' },
    LISTEN_ERROR: { message: 'LISTEN_ERROR' },
    SYSTEM_ERROR: { message: 'SYSTEM_ERROR' },
    NOT_FOUND_ERROR: { message: 'NOT_FOUND_ERROR' },

    // -- USER errors
    INVALID_EMAIL: { message: 'This email address is invalid.' },
    REQUIRED_EMAIL: { message: 'Email required.' },
    EMAIL_ALREADY_EXISTS: { message: 'This email address is already in use.' },
    EMAIL_NOT_EXISTS: { message: 'This email address is not exists.' },
    EMAIL_VERIFICATION_NOT_EXISTS: { message: 'There is no account associated with this address.' },

    ACCOUNT_ALREADY_ACTIVED: { message: 'Account has been activated before.' },
    ACCOUNT_NEED_ACTIVED: { message: 'Account needs to be activated.' },

    TOKEN_REQUIRED: { message: 'Token is required.'},
    USER_NOT_EXISTS: { message: 'User is not found.' },
    INCORRECT_PASSWORD: { message: 'Incorrect password.' },

    PASSWORD_MAX_255_ERROR: { message: 'Password must be less than 255 character.' },
    PASSWORD_REQUIRED: { message: 'Password required.' },
    PASSWORD_MIN_LENGTH_6_ERROR: { message: 'Password must be more than 6 characters.' },
    PASSWORD_INVALID: { message: 'This password is invalid.' },

    INVALID_TOKEN: { message: 'Token is invalid.' },
    TOKEN_EXPIRED_ERROR: { message: 'Token is expired.' },
    NOT_AUTHENTICATED_ERROR: { message: 'Not authenticated.' },

    REFRESH_TOKEN_REQUIRED: { message: 'Refresh token required.' },
};
