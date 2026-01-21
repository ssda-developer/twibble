import { AUTH_COOKIE_NAME, AUTH_PATH_REGEX, GUEST_PATH_REGEX } from "@/src/constants/auth";
import { matchAny } from "@/src/utils";
import { NextResponse } from "next/server";

export function middleware(req) {
    const { pathname } = req.nextUrl;

    if (pathname.startsWith("/_next") || pathname.startsWith("/favicon.ico") || pathname.startsWith("/api")) {
        return NextResponse.next();
    }

    const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
    const isAuth = Boolean(token);

    if (isAuth) {
        if (!matchAny(pathname, AUTH_PATH_REGEX)) {
            return NextResponse.redirect(new URL("/", req.url));
        }
        return NextResponse.next();
    }

    if (!matchAny(pathname, GUEST_PATH_REGEX)) {
        return NextResponse.redirect(new URL("/authorization", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
