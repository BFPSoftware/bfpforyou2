"use client";

import React, { Component, type ErrorInfo, type ReactNode } from "react";
import logError from "@/common/logError";

type Props = {
    children: ReactNode;
    routeName: string;
    /** Optional fallback; default keeps a compact inline recovery UI. */
    fallback?: ReactNode;
};

type State = {
    error: Error | null;
};

/**
 * Catches render/DOM errors in a form section without wiping the whole route.
 * Especially useful for insertBefore NotFoundError from browser extensions / Translate.
 */
export default class FormSectionErrorBoundary extends Component<Props, State> {
    state: State = { error: null };

    static getDerivedStateFromError(error: Error): State {
        return { error };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        void logError(
            error,
            {
                route: this.props.routeName,
                name: error.name,
                message: error.message,
                componentStack: info.componentStack?.slice(0, 4000),
                href: typeof window !== "undefined" ? window.location.href : undefined,
                userAgent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
            },
            `FormSectionErrorBoundary:${this.props.routeName}`
        );
    }

    private retry = () => {
        this.setState({ error: null });
    };

    render() {
        if (this.state.error) {
            if (this.props.fallback) return this.props.fallback;
            return (
                <div className="rounded-md border border-red-200 bg-red-50 p-4 my-4 text-center space-y-3">
                    <p className="text-slate-700 text-sm">
                        Part of the form hit an unexpected display error. Your other answers are usually still intact —
                        try restoring this section, or refresh if needed.
                    </p>
                    <button type="button" className="btn-theme" onClick={this.retry}>
                        Restore section
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}
