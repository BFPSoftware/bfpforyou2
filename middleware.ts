import { NextRequest, NextResponse } from "next/server";
import { locales } from "./types/locales";

// Get the preferred locale, similar to the above or using a library
function getLocale(request: NextRequest) {
    return request.cookies.get("locale") || "en";
}

export function middleware(request: NextRequest) {
    // Check if there is any supported locale in the pathname
    const { pathname } = request.nextUrl;
    const pathnameHasLocale = locales.some((locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`);

    if (pathnameHasLocale) return;

    // Redirect if there is no locale
    const locale = getLocale(request);
    request.nextUrl.pathname = `/${locale}${pathname}`;
    // e.g. incoming request is /products
    // The new URL is now /en-US/products
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
