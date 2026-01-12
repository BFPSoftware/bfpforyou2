"use client";
import { Student } from "@/types/student";
import { Locale } from "@/types/locales";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { OriginalResponseDetailModal } from "./OriginalResponsesModal";
import { parseCookies } from "nookies";
import { SortableHeader } from "./SortableHeader";
import { SortConfig, SortField, sortOriginalResponses } from "../utils/sorting";
import { DateTime } from "luxon";
import { REST_SavedFACApplication } from "@/types/FACApplication";

/**
 * Get the school value based on application type
 * Highschool uses "school" field, Elementary uses "elemSchool" field
 */
const getSchoolValue = (response: REST_SavedFACApplication): string => {
    if (response.applicationType.value === "Highschool") {
        return response.school?.value || "";
    } else {
        return response.elemSchool?.value || "";
    }
};

interface DashboardClientProps {
    lang: Locale;
    dict: any;
    dummyStudents: Student[];
}

export function DashboardClient({ lang, dict, dummyStudents }: DashboardClientProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [originalResponses, setOriginalResponses] = useState<REST_SavedFACApplication[]>([]);
    console.log(originalResponses);
    const [selectedResponse, setSelectedResponse] = useState<REST_SavedFACApplication | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [teacherName, setTeacherName] = useState("");
    const [sortConfig, setSortConfig] = useState<SortConfig | null>({
        field: "createdDateTime",
        direction: "desc",
    });
    const router = useRouter();

    useEffect(() => {
        const getOriginalResponses = async () => {
            try {
                setIsLoading(true);
                const response = await fetch("/api/admin/get-original-responses");
                if (!response.ok) {
                    throw new Error("Failed to fetch original responses");
                }
                const data = await response.json();
                setOriginalResponses(data);
            } catch (error) {
                console.error("Error fetching original responses:", error);
                // You might want to show an error message to the user here
            } finally {
                setIsLoading(false);
            }
        };
        getOriginalResponses();
    }, []);

    useEffect(() => {
        const getTeacherName = async () => {
            const cookieStore = await parseCookies();
            if (cookieStore.teacherName) {
                setTeacherName(cookieStore.teacherName);
            }
        };
        getTeacherName();
    }, []);

    const handleSort = (field: SortField) => {
        console.log("field", field);
        console.log("sortConfig", sortConfig);
        setSortConfig((prevSort) => {
            if (!prevSort || prevSort.field !== field) {
                return { field, direction: "asc" };
            }
            if (prevSort.direction === "asc") {
                return { field, direction: "desc" };
            }
            if (prevSort.direction === "desc") {
                return { field, direction: "asc" };
            }
            return null;
        });
    };

    const filteredOriginalResponses = useMemo(() => {
        if (searchTerm === "") {
            return sortOriginalResponses(originalResponses, sortConfig);
        }
        const filtered = originalResponses.filter((response) => response.firstName.value.toLowerCase().includes(searchTerm.toLowerCase()));
        return sortOriginalResponses(filtered, sortConfig);
    }, [originalResponses, searchTerm, sortConfig]);

    const handleLogout = async () => {
        // Delete the teacherId cookie
        await fetch("/api/admin/logout", {
            method: "POST",
        });
        router.push(`/${lang}/admin`);
        router.refresh();
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">{dict.admin.dashboard.title}</h1>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 mr-10">{teacherName || "-"}</span>
                    <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                        {dict.admin.dashboard.logout}
                    </button>
                </div>
            </div>

            <div className="mb-4">
                <input type="text" placeholder={dict.admin.dashboard.search} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
            </div>

            <div className="bg-white rounded-lg shadow">
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        Total {filteredOriginalResponses.length}
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <SortableHeader field="name" label={dict.admin.dashboard.details.name} currentSort={sortConfig} onSort={handleSort} />
                                    <SortableHeader field="school" label={dict.admin.dashboard.details.school} currentSort={sortConfig} onSort={handleSort} />
                                    <SortableHeader field="grade" label={dict.admin.dashboard.details.grade} currentSort={sortConfig} onSort={handleSort} />
                                    <SortableHeader field="createdDateTime" label={dict.admin.dashboard.details.submissionDate} currentSort={sortConfig} onSort={handleSort} />
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredOriginalResponses.map((response) => (
                                    <tr key={response.$id.value} onClick={() => setSelectedResponse(response)} className="hover:bg-gray-50 cursor-pointer">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {response.firstName.value} {response.lastName.value}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">{getSchoolValue(response)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{response.grade.value}</td>
                                        {/* <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${student.status === "Approved" ? "bg-green-100 text-green-800" : student.status === "Rejected" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"}`}>{student.status}</span>
                                    </td> */}
                                        <td className="px-6 py-4 whitespace-nowrap">{DateTime.fromISO(response.Created_datetime.value).toFormat("dd LLL, yyyy")}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <OriginalResponseDetailModal response={selectedResponse} isOpen={!!selectedResponse} onClose={() => setSelectedResponse(null)} dict={dict} />
        </div>
    );
}
