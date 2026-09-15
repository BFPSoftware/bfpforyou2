"use client";
import { IssueCode } from "../reviewTypes";

const ISSUE_STYLES: Record<IssueCode, string> = {
    missing_photo: "bg-amber-100 text-amber-900",
    missing_attachment_1: "bg-amber-100 text-amber-900",
    missing_attachment_2: "bg-amber-100 text-amber-900",
    missing_attachment_3: "bg-amber-100 text-amber-900",
    empty_essay: "bg-orange-100 text-orange-900",
    missing_id: "bg-red-100 text-red-800",
    missing_phone: "bg-red-100 text-red-800",
    missing_email: "bg-red-100 text-red-800",
    incomplete_spouse: "bg-orange-100 text-orange-900",
    duplicate: "bg-purple-100 text-purple-900",
};

interface IssueChipsProps {
    issues: IssueCode[];
    labels: Record<string, string>;
    compact?: boolean;
}

export function IssueChips({ issues, labels, compact }: IssueChipsProps) {
    if (issues.length === 0) {
        return <span className="text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded">{labels.ok || "OK"}</span>;
    }

    return (
        <div className={`flex flex-wrap gap-1 ${compact ? "max-w-[220px]" : ""}`}>
            {issues.map((code) => (
                <span key={code} className={`text-xs px-2 py-0.5 rounded font-medium ${ISSUE_STYLES[code]}`}>
                    {labels[code] || code}
                </span>
            ))}
        </div>
    );
}
