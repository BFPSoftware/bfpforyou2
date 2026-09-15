"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

const DEFAULT_PAGE_SIZES = [25, 50, 100] as const;

export function usePagination<T>(items: T[], initialPageSize = 25) {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(initialPageSize);

    useEffect(() => {
        setPage(1);
    }, [items, pageSize]);

    const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

    useEffect(() => {
        if (page > totalPages) setPage(totalPages);
    }, [page, totalPages]);

    const pageItems = useMemo(() => {
        const start = (page - 1) * pageSize;
        return items.slice(start, start + pageSize);
    }, [items, page, pageSize]);

    return {
        page,
        setPage,
        pageSize,
        setPageSize,
        totalPages,
        pageItems,
        pageSizes: DEFAULT_PAGE_SIZES,
        total: items.length,
        rangeLabel: items.length === 0 ? "0–0" : `${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, items.length)}`,
    };
}

type VirtualRowProps<T> = {
    items: T[];
    rowHeight?: number;
    overscan?: number;
    maxHeight?: number;
    getKey: (item: T, index: number) => string;
    renderRow: (item: T, index: number) => React.ReactNode;
    header?: React.ReactNode;
};

export function VirtualizedTableBody<T>({
    items,
    rowHeight = 56,
    overscan = 8,
    maxHeight = 560,
    getKey,
    renderRow,
    header,
}: VirtualRowProps<T>) {
    const parentRef = useRef<HTMLDivElement>(null);
    const [scrollTop, setScrollTop] = useState(0);

    const onScroll = useCallback(() => {
        if (parentRef.current) setScrollTop(parentRef.current.scrollTop);
    }, []);

    const totalHeight = items.length * rowHeight;
    const visibleCount = Math.ceil(maxHeight / rowHeight) + overscan;
    const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - Math.floor(overscan / 2));
    const endIndex = Math.min(items.length, startIndex + visibleCount);
    const offsetY = startIndex * rowHeight;
    const visibleItems = items.slice(startIndex, endIndex);

    // Small lists: no need to virtualize
    if (items.length <= 40) {
        return (
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    {header}
                    <tbody className="bg-white divide-y divide-gray-200">
                        {items.map((item, index) => (
                            <tr key={getKey(item, index)}>{renderRow(item, index)}</tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    return (
        <div ref={parentRef} onScroll={onScroll} className="overflow-auto" style={{ maxHeight }}>
            <table className="min-w-full divide-y divide-gray-200">
                {header}
            </table>
            <div style={{ height: totalHeight, position: "relative" }}>
                <table className="min-w-full absolute left-0 right-0" style={{ transform: `translateY(${offsetY}px)` }}>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {visibleItems.map((item, i) => {
                            const index = startIndex + i;
                            return (
                                <tr key={getKey(item, index)} style={{ height: rowHeight }}>
                                    {renderRow(item, index)}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

interface PaginationControlsProps {
    page: number;
    totalPages: number;
    pageSize: number;
    pageSizes: readonly number[];
    total: number;
    rangeLabel: string;
    labels: {
        pageSize: string;
        of: string;
        prev: string;
        next: string;
        showing: string;
    };
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
}

export function PaginationControls({
    page,
    totalPages,
    pageSize,
    pageSizes,
    total,
    rangeLabel,
    labels,
    onPageChange,
    onPageSizeChange,
}: PaginationControlsProps) {
    if (total === 0) return null;

    return (
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-t bg-gray-50 text-sm">
            <div className="flex items-center gap-2">
                <span className="text-gray-600">{labels.pageSize}</span>
                <select
                    value={pageSize}
                    onChange={(e) => onPageSizeChange(Number(e.target.value))}
                    className="border rounded px-2 py-1 bg-white"
                >
                    {pageSizes.map((size) => (
                        <option key={size} value={size}>
                            {size}
                        </option>
                    ))}
                </select>
                <span className="text-gray-500">
                    {labels.showing} {rangeLabel} {labels.of} {total}
                </span>
            </div>
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    className="px-3 py-1 border rounded bg-white disabled:opacity-40"
                    disabled={page <= 1}
                    onClick={() => onPageChange(page - 1)}
                >
                    {labels.prev}
                </button>
                <span className="text-gray-600">
                    {page} / {totalPages}
                </span>
                <button
                    type="button"
                    className="px-3 py-1 border rounded bg-white disabled:opacity-40"
                    disabled={page >= totalPages}
                    onClick={() => onPageChange(page + 1)}
                >
                    {labels.next}
                </button>
            </div>
        </div>
    );
}
