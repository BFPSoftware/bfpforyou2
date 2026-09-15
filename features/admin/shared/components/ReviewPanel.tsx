"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { normalizeReviewStatus, REVIEW_STATUSES, ReviewStatus } from "../reviewTypes";

interface ReviewPanelProps {
    recordId: string;
    status: ReviewStatus;
    notes: string;
    seen: boolean;
    labels: {
        status: string;
        notes: string;
        notesPlaceholder: string;
        save: string;
        saved: string;
        localOnly: string;
        markSeen: string;
        unseen: string;
        seen: string;
    };
    onSave: (status: ReviewStatus, notes: string) => void;
}

/** Personal review state — saved on this device only, never written to Kintone. */
export function ReviewPanel({
    recordId,
    status,
    notes,
    seen,
    labels,
    onSave,
}: ReviewPanelProps) {
    const [currentStatus, setCurrentStatus] = useState<ReviewStatus>(normalizeReviewStatus(status));
    const [currentNotes, setCurrentNotes] = useState(notes || "");
    const [message, setMessage] = useState(false);

    useEffect(() => {
        setCurrentStatus(normalizeReviewStatus(status));
        setCurrentNotes(notes || "");
        setMessage(false);
    }, [recordId, status, notes]);

    const handleSave = () => {
        onSave(currentStatus, currentNotes);
        setMessage(true);
    };

    return (
        <div className="col-span-2 mt-4 border rounded-lg p-4 bg-slate-50 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs text-slate-500">{labels.localOnly}</p>
                <span
                    className={`text-xs px-2 py-0.5 rounded font-medium ${
                        seen ? "bg-slate-200 text-slate-700" : "bg-sky-100 text-sky-900"
                    }`}
                >
                    {seen ? labels.seen : labels.unseen}
                </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                    <label className="block text-sm font-semibold mb-1">{labels.status}</label>
                    <select
                        value={currentStatus}
                        onChange={(e) => setCurrentStatus(e.target.value as ReviewStatus)}
                        className="w-full px-3 py-2 border rounded-md bg-white"
                    >
                        {REVIEW_STATUSES.map((s) => (
                            <option key={s} value={s}>
                                {s}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold mb-1">{labels.notes}</label>
                    <textarea
                        value={currentNotes}
                        onChange={(e) => setCurrentNotes(e.target.value)}
                        rows={3}
                        placeholder={labels.notesPlaceholder}
                        className="w-full px-3 py-2 border rounded-md bg-white"
                    />
                </div>
            </div>
            <div className="flex items-center gap-3">
                <Button type="button" onClick={handleSave}>
                    {labels.save}
                </Button>
                {message && <span className="text-sm text-green-700">{labels.saved}</span>}
            </div>
        </div>
    );
}
