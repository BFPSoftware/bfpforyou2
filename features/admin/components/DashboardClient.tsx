"use client";
import { Locale } from "@/types/locales";
import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { OriginalResponseDetailModal } from "./OriginalResponsesModal";
import { parseCookies } from "nookies";
import { SortableHeader } from "./SortableHeader";
import { SortConfig, SortField, sortOriginalResponses } from "../utils/sorting";
import { DateTime } from "luxon";
import { REST_SavedFACApplication } from "@/types/FACApplication";
import { AttentionTabs } from "@/features/admin/shared/components/AttentionTabs";
import { FetchErrorState } from "@/features/admin/shared/components/FetchErrorState";
import { IssueChips } from "@/features/admin/shared/components/IssueChips";
import { detectFacIssues, hasMissingFiles, hasNeedsAttention } from "@/features/admin/shared/issues";
import { findFacDuplicateIds } from "@/features/admin/shared/duplicates";
import { downloadCsv } from "@/features/admin/shared/exportCsv";
import { AttentionFilter, IssueCode, ReviewStatus } from "@/features/admin/shared/reviewTypes";
import { getLocalReview } from "@/features/admin/shared/localReviewStorage";
import { useLocalReviews } from "@/features/admin/shared/useLocalReviews";
import { PaginationControls, usePagination, VirtualizedTableBody } from "@/features/admin/shared/pagination";
import { Button } from "@/components/ui/button";

const getSchoolValue = (response: REST_SavedFACApplication): string => {
    if (response.applicationType.value === "Highschool") {
        return response.school?.value || "";
    }
    return response.elemSchool?.value || "";
};

interface DashboardClientProps {
    lang: Locale;
    dict: any;
}

type Enriched = REST_SavedFACApplication & { issues: IssueCode[]; seen: boolean; localStatus: ReviewStatus };

export function DashboardClient({ lang, dict }: DashboardClientProps) {
    const t = dict.admin.dashboard;
    const review = dict.admin.review;
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [originalResponses, setOriginalResponses] = useState<REST_SavedFACApplication[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [teacherName, setTeacherName] = useState("");
    const [adminId, setAdminId] = useState("");
    const [attention, setAttention] = useState<AttentionFilter>("unseen");
    const [schoolFilter, setSchoolFilter] = useState("all");
    const [typeFilter, setTypeFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const [sortConfig, setSortConfig] = useState<SortConfig | null>({
        field: "createdDateTime",
        direction: "desc",
    });
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const selectedId = searchParams.get("id");
    const { reviews, markRecordSeen, saveReview, markManySeen } = useLocalReviews("fac", adminId);

    const load = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await fetch("/api/admin/get-original-responses");
            if (response.status === 401) {
                router.push(`/${lang}/admin`);
                return;
            }
            if (!response.ok) throw new Error("Failed to fetch");
            const data = await response.json();
            setOriginalResponses(data);
            setLastUpdated(new Date());
        } catch {
            setError(review.fetchError);
            setOriginalResponses([]);
        } finally {
            setIsLoading(false);
        }
    }, [lang, review.fetchError, router]);

    useEffect(() => {
        load();
    }, [load]);

    useEffect(() => {
        const cookies = parseCookies();
        if (cookies.teacherName) setTeacherName(cookies.teacherName);
        if (cookies.teacherId) setAdminId(cookies.teacherId);
    }, []);

    const duplicateIds = useMemo(() => findFacDuplicateIds(originalResponses), [originalResponses]);

    const enriched: Enriched[] = useMemo(
        () =>
            originalResponses.map((r) => {
                const issues = detectFacIssues(r);
                if (duplicateIds.has(r.$id.value)) issues.push("duplicate");
                const local = getLocalReview(reviews, r.$id.value);
                return { ...r, issues, seen: local.seen, localStatus: local.status };
            }),
        [originalResponses, duplicateIds, reviews]
    );

    const schools = useMemo(() => {
        const set = new Set(enriched.map(getSchoolValue).filter(Boolean));
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
            if (schoolFilter !== "all" && getSchoolValue(r) !== schoolFilter) return false;
            if (typeFilter !== "all" && r.applicationType?.value !== typeFilter) return false;
            if (statusFilter !== "all" && r.localStatus !== statusFilter) return false;
            if (!term) return true;
            const hay = [
                r.firstName?.value,
                r.lastName?.value,
                r.tz?.value,
                getSchoolValue(r),
                r.grade?.value,
                r.ticket?.value,
            ]
                .join(" ")
                .toLowerCase();
            return hay.includes(term);
        });
        return sortOriginalResponses(list, sortConfig) as Enriched[];
    }, [enriched, searchTerm, sortConfig, attention, schoolFilter, typeFilter, statusFilter, selectedId]);

    const pagination = usePagination(filtered, 25);
    const pageItems = pagination.pageItems;

    // Resolve from full enriched list so marking seen never closes the modal early
    const selectedResponse = useMemo(
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

    const handleSort = (field: SortField) => {
        setSortConfig((prev) => {
            if (!prev || prev.field !== field) return { field, direction: "asc" };
            return { field, direction: prev.direction === "asc" ? "desc" : "asc" };
        });
    };

    const handleLogout = async () => {
        await fetch("/api/admin/logout", { method: "POST" });
        router.push(`/${lang}/admin`);
        router.refresh();
    };

    const handleExport = () => {
        downloadCsv(
            `fac-submissions-${DateTime.now().toFormat("yyyyMMdd")}.csv`,
            ["ID", "Name", "School", "Grade", "Type", "TZ", "My Status", "Seen", "Issues", "Submitted"],
            filtered.map((r) => [
                r.$id.value,
                `${r.firstName?.value || ""} ${r.lastName?.value || ""}`.trim(),
                getSchoolValue(r),
                r.grade?.value || "",
                r.applicationType?.value || "",
                r.tz?.value || "",
                r.localStatus,
                r.seen ? "yes" : "no",
                r.issues.join("; "),
                r.Created_datetime?.value || "",
            ])
        );
    };

    const localReview = selectedResponse
        ? getLocalReview(reviews, selectedResponse.$id.value)
        : null;

    return (
        <div>
            <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
                <h1 className="text-2xl font-bold">{t.title}</h1>
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm text-gray-500">{teacherName || "—"}</span>
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
                    value={schoolFilter}
                    onChange={(e) => setSchoolFilter(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg bg-white"
                >
                    <option value="all">{review.filters.allSchools}</option>
                    {schools.map((s) => (
                        <option key={s} value={s}>
                            {s}
                        </option>
                    ))}
                </select>
                <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg bg-white"
                >
                    <option value="all">{review.filters.allTypes}</option>
                    <option value="Elementary">Elementary</option>
                    <option value="Highschool">Highschool</option>
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
                    <div className="p-8 text-center text-gray-500">{t.noStudents}</div>
                ) : (
                    <>
                        <div className="px-4 py-2 text-sm text-gray-600">
                            {review.total} {filtered.length}
                        </div>
                        <VirtualizedTableBody
                            items={pageItems}
                            getKey={(r) => r.$id.value}
                            header={
                                <thead className="bg-gray-50">
                                    <tr>
                                        <SortableHeader field="name" label={t.details.name} currentSort={sortConfig} onSort={handleSort} />
                                        <SortableHeader field="school" label={t.details.school} currentSort={sortConfig} onSort={handleSort} />
                                        <SortableHeader field="grade" label={t.details.grade} currentSort={sortConfig} onSort={handleSort} />
                                        <SortableHeader field="status" label={review.status} currentSort={sortConfig} onSort={handleSort} />
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{review.issues}</th>
                                        <SortableHeader
                                            field="createdDateTime"
                                            label={t.details.submissionDate}
                                            currentSort={sortConfig}
                                            onSort={handleSort}
                                        />
                                    </tr>
                                </thead>
                            }
                            renderRow={(response) => (
                                <>
                                    <td
                                        className={`px-6 py-4 whitespace-nowrap cursor-pointer ${!response.seen ? "font-semibold" : ""}`}
                                        onClick={() => setSelectedId(response.$id.value)}
                                    >
                                        {!response.seen && (
                                            <span className="inline-block w-2 h-2 rounded-full bg-sky-500 mr-2 align-middle" title={review.tabs.unseen} />
                                        )}
                                        {response.firstName.value} {response.lastName.value}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap cursor-pointer" onClick={() => setSelectedId(response.$id.value)}>
                                        {getSchoolValue(response)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap cursor-pointer" onClick={() => setSelectedId(response.$id.value)}>
                                        {response.grade.value}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm cursor-pointer" onClick={() => setSelectedId(response.$id.value)}>
                                        {response.localStatus}
                                    </td>
                                    <td className="px-6 py-4 cursor-pointer" onClick={() => setSelectedId(response.$id.value)}>
                                        <IssueChips issues={response.issues} labels={review.issueLabels} compact />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap cursor-pointer" onClick={() => setSelectedId(response.$id.value)}>
                                        {DateTime.fromISO(response.Created_datetime.value).toFormat("dd LLL, yyyy")}
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

            <OriginalResponseDetailModal
                response={selectedResponse}
                isOpen={!!selectedResponse}
                onClose={() => setSelectedId(null)}
                dict={dict}
                localReview={localReview}
                onSaveLocalReview={(status, notes) => {
                    if (selectedResponse) saveReview(selectedResponse.$id.value, status, notes);
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
