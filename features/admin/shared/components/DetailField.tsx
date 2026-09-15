"use client";
import { isEmpty } from "../reviewTypes";

interface DetailFieldProps {
    label: string;
    value?: string | null;
    missing?: boolean;
    className?: string;
}

export function DetailField({ label, value, missing, className }: DetailFieldProps) {
    const empty = missing ?? isEmpty(value);
    return (
        <div className={className}>
            <h3 className={`font-semibold mb-2 ${empty ? "text-amber-800" : ""}`}>
                {label}
                {empty && <span className="ml-1 text-xs font-normal text-amber-700">(missing)</span>}
            </h3>
            <p
                className={`whitespace-pre-wrap break-words ${
                    empty ? "rounded border border-amber-300 bg-amber-50 px-2 py-1 text-amber-900" : ""
                }`}
            >
                {empty ? "—" : value}
            </p>
        </div>
    );
}
