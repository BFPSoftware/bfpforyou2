"use client";
import { Button } from "@/components/ui/button";

interface FetchErrorStateProps {
    message: string;
    retryLabel: string;
    onRetry: () => void;
}

export function FetchErrorState({ message, retryLabel, onRetry }: FetchErrorStateProps) {
    return (
        <div className="flex flex-col items-center justify-center h-64 gap-3 px-4 text-center">
            <p className="text-red-600">{message}</p>
            <Button type="button" variant="outline" onClick={onRetry}>
                {retryLabel}
            </Button>
        </div>
    );
}
