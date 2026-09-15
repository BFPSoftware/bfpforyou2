"use client";
import { Locale } from "@/types/locales";
import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { parseCookies } from "nookies";
import { DateTime } from "luxon";
import { ImmigrantDetailModal } from "./ImmigrantDetailModal";
import { ImmigrantSortableHeader } from "./SortableHeader";
import {
    ImmigrantApplication,
    ImmigrantSortConfig,
    ImmigrantSortField,
    sortImmigrantApplications,
} from "../utils/sorting";
import { AttentionTabs } from "@/features/admin/shared/components/AttentionTabs";
import { FetchErrorState } from "@/features/admin/shared/components/FetchErrorState";
import { IssueChips } from "@/features/admin/shared/components/IssueChips";
import {
    detectImmigrantIssues,
    hasMissingFiles,
    hasNeedsAttention,
} from "@/features/admin/shared/issues";
import { findImmigrantDuplicateIds } from "@/features/admin/shared/duplicates";
import { downloadCsv } from "@/features/admin/shared/exportCsv";
import { AttentionFilter, IssueCode, ReviewStatus } from "@/features/admin/shared/reviewTypes";
import { getLocalReview } from "@/features/admin/shared/localReviewStorage";
import { useLocalReviews } from "@/features/admin/shared/useLocalReviews";
import { PaginationControls, usePagination, VirtualizedTableBody } from "@/features/admin/shared/pagination";
import { Button } from "@/components/ui/button";

interface ImmigrantDashboardClientProps {
    lang: Locale;
    dict: any;
}

type Enriched = ImmigrantApplication & { issues: IssueCode[]; seen: boolean; localStatus: ReviewStatus };

export function ImmigrantDashboardClient({ lang, dict }: ImmigrantDashboardClientProps) {
    const t = dict.admin.immigrant.dashboard;
    const review = dict.admin.review;
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [applications, setApplications] = useState<ImmigrantApplication[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [adminName, setAdminName] = useState("");
    const [adminId, setAdminId] = useState("");
    const [attention, setAttention] = useState<AttentionFilter>("unseen");
    const [ticketFilter, setTicketFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const [sortConfig, setSortConfig] = useState<ImmigrantSortConfig | null>({
        field: "createdDateTime",
        direction: "desc",
    });
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const selectedId = searchParams.get("id");
    const { reviews, markRecordSeen, saveReview, markManySeen } = useLocalReviews("immigrant", adminId);

    const load = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await fetch("/api/admin/immigrant/get-applications");
            if (response.status === 401) {
                router.push(`/${lang}/admin/immigrant`);
                return;
            }
            if (!response.ok) throw new Error("Failed to fetch");
            const data = await response.json();
            setApplications(data);
            setLastUpdated(new Date());
        } catch {
            setError(review.fetchError);
            setApplications([]);
        } finally {
            setIsLoading(false);
        }
    }, [lang, review.fetchError, router]);

    useEffect(() => {
        load();
    }, [load]);

    useEffect(() => {
        const cookies = parseCookies();
        if (cookies.immigrantAdminName) setAdminName(cookies.immigrantAdminName);
        if (cookies.immigrantAdminId) setAdminId(cookies.immigrantAdminId);
    }, []);

    const duplicateIds = useMemo(() => findImmigrantDuplicateIds(applications), [applications]);

    const enriched: Enriched[] = useMemo(
        () =>
            applications.map((r) => {
                const issues = detectImmigrantIssues(r);
                if (duplicateIds.has(r.$id.value)) issues.push("duplicate");
                const local = getLocalReview(reviews, r.$id.value);
                return { ...r, issues, seen: local.seen, localStatus: local.status };
            }),
        [applications, duplicateIds, reviews]
    );

    const tickets = useMemo(() => {
        const set = new Set(enriched.map((r) => r.ticket?.value).filter(Boolean) as string[]);
        return Array.from(set).sort();
    }, [enriched]);

    const counts = useMemo(
        () => ({
            all: enriched.length,
            unseen: enriched.filter((r) => !r.seen).length,
            needsAttention: enriched.filter((r) => hasNeedsAttention(r.issues)).length,
            missingFiles: enriched.filter((r) => hasMissingFiles(r.issues)).length,
            duplicates: enriched.filter((r) => r.issues.includes("duplicate")).length,
        }),
        [enriched]
    );

    const filtered = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();
        const list = enriched.filter((r) => {
            // Keep the open record visible on "unseen" so the detail modal can stay open
            if (attention === "unseen" && r.seen && r.$id.value !== selectedId) return false;
            if (attention === "needsAttention" && !hasNeedsAttention(r.issues)) return false;
            if (attention === "missingFiles" && !hasMissingFiles(r.issues)) return false;
            if (attention === "duplicates" && !r.issues.includes("duplicate")) return false;
            if (ticketFilter !== "all" && r.ticket?.value !== ticketFilter) return false;
            if (statusFilter !== "all" && r.localStatus !== statusFilter) return false;
            if (!term) return true;
            const hay = [
                r.firstName?.value,
                r.lastName?.value,
                r.ticket?.value,
                r.addressCity?.value,
                r.IDNumber?.value,
                r.Phone_Number?.value,
                r.email?.value,
            ]
                .join(" ")
                .toLowerCase();
            return hay.includes(term);
        });
        return sortImmigrantApplications(list, sortConfig) as Enriched[];
    }, [enriched, searchTerm, sortConfig, attention, ticketFilter, statusFilter, selectedId]);

    const pagination = usePagination(filtered, 25);
    const pageItems = pagination.pageItems;

    // Resolve from full enriched list so marking seen never closes the modal early
    const selected = useMemo(
        () => enriched.find((r) => r.$id.value === selectedId) || null,
        [enriched, selectedId]
    );
    const selectedIndex = useMemo(
        () => filtered.findIndex((r) => r.$id.value === selectedId),
        [filtered, selectedId]
    );

    const setSelectedId = useCallback(
        (id: string | null) => {
            const params = new URLSearchParams(searchParams.toString());
            if (id) params.set("id", id);
            else params.delete("id");
            const qs = params.toString();
            router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
        },
        [pathname, router, searchParams]
    );

    useEffect(() => {
        if (selectedId) markRecordSeen(selectedId);
    }, [selectedId, markRecordSeen]);

    useEffect(() => {
        if (!selectedId) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setSelectedId(null);
            if (e.key === "ArrowLeft" && selectedIndex > 0) {
                e.preventDefault();
                setSelectedId(filtered[selectedIndex - 1].$id.value);
            }
            if (e.key === "ArrowRight" && selectedIndex >= 0 && selectedIndex < filtered.length - 1) {
                e.preventDefault();
                setSelectedId(filtered[selectedIndex + 1].$id.value);
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [selectedId, selectedIndex, filtered, setSelectedId]);

    const handleSort = (field: ImmigrantSortField) => {
        setSortConfig((prev) => {
            if (!prev || prev.field !== field) return { field, direction: "asc" };
            return { field, direction: prev.direction === "asc" ? "desc" : "asc" };
        });
    };

    const handleLogout = async () => {
        await fetch("/api/admin/immigrant/logout", { method: "POST" });
        router.push(`/${lang}/admin/immigrant`);
        router.refresh();
    };

    const handleExport = () => {
        downloadCsv(
            `immigrant-submissions-${DateTime.now().toFormat("yyyyMMdd")}.csv`,
            ["ID", "Name", "Gift Code", "City", "Aliyah Date", "Phone", "Email", "My Status", "Seen", "Issues", "Submitted"],
            filtered.map((r) => [
                r.$id.value,
                `${r.firstName?.value || ""} ${r.lastName?.value || ""}`.trim(),
                r.ticket?.value || "",
                r.addressCity?.value || "",
                r.aliyahDate?.value || "",
                r.Phone_Number?.value || "",
                r.email?.value || "",
                r.localStatus,
                r.seen ? "yes" : "no",
                r.issues.join("; "),
                r.Created_datetime?.value || "",
            ])
        );
    };

    const localReview = selected ? getLocalReview(reviews, selected.$id.value) : null;

    return (
        <div>
            <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
                <h1 className="text-2xl font-bold">{t.title}</h1>
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm text-gray-500">{adminName || "—"}</span>
                    {lastUpdated && (
                        <span className="text-xs text-gray-400">
                            {review.updated} {DateTime.fromJSDate(lastUpdated).toFormat("HH:mm")}
                        </span>
                    )}
                    <Button type="button" variant="outline" size="sm" onClick={load} disabled={isLoading}>
                        {review.refresh}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => markManySeen(pageItems.map((r) => r.$id.value))}
                        disabled={pageItems.length === 0}
                    >
                        {review.markPageSeen}
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={handleExport} disabled={filtered.length === 0}>
                        {review.exportCsv}
                    </Button>
                    <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                        {t.logout}
                    </button>
                </div>
            </div>

            <AttentionTabs
                value={attention}
                onChange={setAttention}
                counts={counts}
                labels={{
                    all: review.tabs.all,
                    unseen: review.tabs.unseen,
                    needsAttention: review.tabs.needsAttention,
                    missingFiles: review.tabs.missingFiles,
                    duplicates: review.tabs.duplicates,
                }}
            />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
                <input
                    type="text"
                    placeholder={t.search}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg md:col-span-2"
                />
                <select
                    value={ticketFilter}
                    onChange={(e) => setTicketFilter(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg bg-white"
                >
                    <option value="all">{review.filters.allCodes}</option>
                    {tickets.map((code) => (
                        <option key={code} value={code}>
                            {code}
                        </option>
                    ))}
                </select>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg bg-white"
                >
                    <option value="all">{review.filters.allStatuses}</option>
                    <option value="Pending">Pending</option>
                    <option value="Needs Fix">Needs Fix</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                </select>
            </div>

            <div className="bg-white rounded-lg shadow">
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
                    </div>
                ) : error ? (
                    <FetchErrorState message={error} retryLabel={review.retry} onRetry={load} />
                ) : filtered.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">{t.noApplications}</div>
                ) : (
                    <>
                        <div className="px-4 py-2 text-sm text-gray-600">
                            {t.total} {filtered.length}
                        </div>
                        <VirtualizedTableBody
                            items={pageItems}
                            getKey={(r) => r.$id.value}
                            header={
                                <thead className="bg-gray-50">
                                    <tr>
                                        <ImmigrantSortableHeader field="name" label={t.details.name} currentSort={sortConfig} onSort={handleSort} />
                                        <ImmigrantSortableHeader field="ticket" label={t.details.giftCode} currentSort={sortConfig} onSort={handleSort} />
                                        <ImmigrantSortableHeader field="city" label={t.details.city} currentSort={sortConfig} onSort={handleSort} />
                                        <ImmigrantSortableHeader field="status" label={review.status} currentSort={sortConfig} onSort={handleSort} />
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{review.issues}</th>
                                        <ImmigrantSortableHeader
                                            field="createdDateTime"
                                            label={t.details.submissionDate}
                                            currentSort={sortConfig}
                                            onSort={handleSort}
                                        />
                                    </tr>
                                </thead>
                            }
                            renderRow={(app) => (
                                <>
                                    <td
                                        className={`px-6 py-4 whitespace-nowrap cursor-pointer ${!app.seen ? "font-semibold" : ""}`}
                                        onClick={() => setSelectedId(app.$id.value)}
                                    >
                                        {!app.seen && (
                                            <span className="inline-block w-2 h-2 rounded-full bg-sky-500 mr-2 align-middle" title={review.tabs.unseen} />
                                        )}
                                        {app.firstName?.value} {app.lastName?.value}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap cursor-pointer" onClick={() => setSelectedId(app.$id.value)}>
                                        {app.ticket?.value}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap cursor-pointer" onClick={() => setSelectedId(app.$id.value)}>
                                        {app.addressCity?.value}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm cursor-pointer" onClick={() => setSelectedId(app.$id.value)}>
                                        {app.localStatus}
                                    </td>
                                    <td className="px-6 py-4 cursor-pointer" onClick={() => setSelectedId(app.$id.value)}>
                                        <IssueChips issues={app.issues} labels={review.issueLabels} compact />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap cursor-pointer" onClick={() => setSelectedId(app.$id.value)}>
                                        {DateTime.fromISO(app.Created_datetime.value).toFormat("dd LLL, yyyy")}
                                    </td>
                                </>
                            )}
                        />
                        <PaginationControls
                            page={pagination.page}
                            totalPages={pagination.totalPages}
                            pageSize={pagination.pageSize}
                            pageSizes={pagination.pageSizes}
                            total={pagination.total}
                            rangeLabel={pagination.rangeLabel}
                            labels={{
                                pageSize: review.pagination.pageSize,
                                of: review.pagination.of,
                                prev: review.prev,
                                next: review.next,
                                showing: review.pagination.showing,
                            }}
                            onPageChange={pagination.setPage}
                            onPageSizeChange={pagination.setPageSize}
                        />
                    </>
                )}
            </div>

            <ImmigrantDetailModal
                application={selected}
                isOpen={!!selected}
                onClose={() => setSelectedId(null)}
                dict={dict}
                localReview={localReview}
                onSaveLocalReview={(status, notes) => {
                    if (selected) saveReview(selected.$id.value, status, notes);
                }}
                onPrev={selectedIndex > 0 ? () => setSelectedId(filtered[selectedIndex - 1].$id.value) : undefined}
                onNext={
                    selectedIndex >= 0 && selectedIndex < filtered.length - 1
                        ? () => setSelectedId(filtered[selectedIndex + 1].$id.value)
                        : undefined
                }
                positionLabel={selectedIndex >= 0 ? `${selectedIndex + 1} / ${filtered.length}` : undefined}
            />
        </div>
    );
}
