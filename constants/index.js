export const SITE_NAME = "Twibble";

export const GUEST_PATH_REGEX = [
    /^\/$/,
    /^\/authorization$/,
    /^\/[^/]+\/posts\/?$/,
    /^\/[^/]+\/replies\/?$/,
    /^\/[^/]+\/post\/[^/]+\/?$/
];

export const AUTH_PATH_REGEX = [
    ...GUEST_PATH_REGEX,
    /^\/explore$/,
    /^\/notifications$/,
    /^\/messages$/,
    /^\/list$/,
    /^\/[^/]+\/saves\/?$/,
    /^\/[^/]+\/likes\/?$/
];
