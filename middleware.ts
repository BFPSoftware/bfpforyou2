import { NextRequest, NextResponse } from "next/server";
import { locales } from "./types/locales";

// Get the preferred locale, similar to the above or using a library
function getLocale(request: NextRequest) {
    return request.cookies.get("locale") || "en";
}

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // maintenance mode
    if (process.env.MAINTENANCE_MODE === "true" && pathname !== "/en/maintenance") {
        request.nextUrl.pathname = "/en/maintenance";
        return NextResponse.redirect(request.nextUrl);
    }

    // Check if accessing admin routes (except login)
    if (pathname.includes("/admin") && !pathname.endsWith("/admin")) {
        const teacherId = request.cookies.get("teacherId");
        if (!teacherId) {
            const locale = getLocale(request);
            request.nextUrl.pathname = `/${locale}/admin`;
            return NextResponse.redirect(request.nextUrl);
        }
    }

    // Check if there is any supported locale in the pathname
    const pathnameHasLocale = locales.some((locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`);

    if (pathnameHasLocale) return;

    // Redirect if there is no locale
    const locale = getLocale(request);
    request.nextUrl.pathname = `/${locale}${pathname}`;
    return NextResponse.redirect(request.nextUrl);
}

export const config = {
    matcher: [
        // Skip all internal paths (_next) and API routes (/api)
        "/((?!_next|api).*)",
        // Optional: only run on root (/) URL
        // '/'
    ],
};
