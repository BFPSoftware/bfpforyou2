"use client";

import { useEffect } from "react";
import Link from "next/link";
import logError from "@/common/logError";

type FormRouteErrorProps = {
    error: Error & { digest?: string };
    reset: () => void;
    routeName: string;
};

export default function FormRouteError({ error, reset, routeName }: FormRouteErrorProps) {
    useEffect(() => {
        void logError(error, { digest: error.digest, route: routeName }, `FormRouteError:${routeName}`);
    }, [error, routeName]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center gap-4">
            <h2 className="text-2xl font-semibold text-slate-800">Something went wrong</h2>
            <p className="text-slate-600 max-w-md">
                The form encountered an unexpected error. You can try again without refreshing the whole site, or return
                to the home page to start over.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
                <button type="button" onClick={() => reset()} className="btn-theme">
                    Try again
                </button>
                <Link href="/" className="btn-gray inline-block px-6 py-2 rounded-full">
                    Go to home
                </Link>
            </div>
        </div>
    );
}
