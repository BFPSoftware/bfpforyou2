"use client";
import { AttentionFilter } from "../reviewTypes";

interface AttentionTabsProps {
    value: AttentionFilter;
    onChange: (value: AttentionFilter) => void;
    counts: Record<AttentionFilter, number>;
    labels: Record<AttentionFilter, string>;
}

export function AttentionTabs({ value, onChange, counts, labels }: AttentionTabsProps) {
    const tabs: AttentionFilter[] = ["unseen", "all", "needsAttention", "missingFiles", "duplicates"];

    return (
        <div className="flex flex-wrap gap-2 mb-4">
            {tabs.map((tab) => {
                const active = value === tab;
                return (
                    <button
                        key={tab}
                        type="button"
                        onClick={() => onChange(tab)}
                        className={`px-3 py-1.5 rounded-full text-sm border ${
                            active
                                ? "bg-slate-900 text-white border-slate-900"
                                : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                        }`}
                    >
                        {labels[tab]} ({counts[tab]})
                    </button>
                );
            })}
        </div>
    );
}
