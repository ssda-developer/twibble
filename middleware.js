import { matchAny } from "@/utils";
import { NextResponse } from "next/server";
import { AUTH_PATH_REGEX, GUEST_PATH_REGEX } from "./constants";

export function middleware(req) {
    const { pathname } = req.nextUrl;

    if (pathname.startsWith("/_next") || pathname.startsWith("/favicon.ico") || pathname.startsWith("/api")) {
        return NextResponse.next();
    }

    const token = req.cookies.get("auth_token")?.value;
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
