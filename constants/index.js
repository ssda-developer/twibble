export const SITE_NAME = "Twibble";

export const AUTH_PATH_REGEX = [
    /^\/$/,
    /^\/authorization$/,
    /^\/explore$/,
    /^\/notifications$/,
    /^\/messages$/,
    /^\/list$/,
    /^\/[^/]+\/posts\/?$/,
    /^\/[^/]+\/replies\/?$/,
    /^\/[^/]+\/saves\/?$/,
    /^\/[^/]+\/likes\/?$/,
    /^\/[^/]+\/post\/[^/]+\/?$/
];

export const GUEST_PATH_REGEX = [
    /^\/$/,
    /^\/authorization$/,
    /^\/[^/]+\/posts\/?$/,
    /^\/[^/]+\/replies\/?$/,
    /^\/[^/]+\/saves\/?$/,
    /^\/[^/]+\/likes\/?$/,
    /^\/[^/]+\/post\/[^/]+\/?$/
];
