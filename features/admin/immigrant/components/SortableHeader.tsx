"use client";
import { ImmigrantSortConfig, ImmigrantSortField, SortDirection } from "../utils/sorting";

interface SortableHeaderProps {
    field: ImmigrantSortField;
    label: string;
    currentSort: ImmigrantSortConfig | null;
    onSort: (field: ImmigrantSortField) => void;
}

export function ImmigrantSortableHeader({ field, label, currentSort, onSort }: SortableHeaderProps) {
    const isCurrentField = currentSort?.field === field;
    const direction: SortDirection = isCurrentField ? currentSort.direction : null;

    return (
        <th
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group"
            onClick={() => onSort(field)}
        >
            <div className="flex items-center gap-1">
                {label}
                <span className="text-gray-400">{direction === "asc" ? "↑" : direction === "desc" ? "↓" : "↕"}</span>
            </div>
        </th>
    );
}
