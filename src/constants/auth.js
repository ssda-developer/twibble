export const AUTH_COOKIE_NAME = "auth_token";
export const AUTH_TOKEN_EXPIRY = "7d";
export const AUTH_COOKIE_MAX_AGE = 7 * 24 * 60 * 60;

export const GUEST_PATH_REGEX = [
    /^\/$/,
    /^\/authorization$/,
    /^\/[^/]+\/posted\/?$/,
    /^\/[^/]+\/replied\/?$/,
    /^\/[^/]+\/post\/[^/]+\/?$/
];

export const AUTH_PATH_REGEX = [
    ...GUEST_PATH_REGEX,
    /^\/explore$/,
    /^\/notifications$/,
    /^\/messages$/,
    /^\/list$/,
    /^\/[^/]+\/saved\/?$/,
    /^\/[^/]+\/liked\/?$/
];
