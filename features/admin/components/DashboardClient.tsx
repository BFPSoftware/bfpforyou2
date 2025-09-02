"use client";
import { Student } from "@/types/student";
import { Locale } from "@/types/locales";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { StudentDetailModal } from "./StudentDetailModal";
import { parseCookies } from "nookies";
import { SortableHeader } from "./SortableHeader";
import { SortConfig, SortField, sortStudents } from "../utils/sorting";
import { DateTime } from "luxon";

interface DashboardClientProps {
    lang: Locale;
    dict: any;
    dummyStudents: Student[];
}

export function DashboardClient({ lang, dict, dummyStudents }: DashboardClientProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [students, setStudents] = useState<Student[]>([]);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [teacherName, setTeacherName] = useState("");
    const [sortConfig, setSortConfig] = useState<SortConfig | null>({
        field: "submissionDate",
        direction: "desc",
    });
    const router = useRouter();

    useEffect(() => {
        const getStudents = async () => {
            try {
                setIsLoading(true);
                const response = await fetch("/api/admin/get-students");
                if (!response.ok) {
                    throw new Error("Failed to fetch students");
                }
                const data = await response.json();
                setStudents(data);
            } catch (error) {
                console.error("Error fetching students:", error);
                // You might want to show an error message to the user here
            } finally {
                setIsLoading(false);
            }
        };
        getStudents();
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
        setSortConfig((prevSort) => {
            if (!prevSort || prevSort.field !== field) {
                return { field, direction: "asc" };
            }
            if (prevSort.direction === "asc") {
                return { field, direction: "desc" };
            }
            if (prevSort.direction === "desc") {
                return { field: "submissionDate", direction: "desc" };
            }
            return null;
        });
    };

    const filteredStudents = useMemo(() => {
        const filtered = students.filter((student) => student.name.toLowerCase().includes(searchTerm.toLowerCase()));
        return sortStudents(filtered, sortConfig);
    }, [students, searchTerm, sortConfig]);

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
                        Total {filteredStudents.length}
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <SortableHeader field="name" label={dict.admin.dashboard.details.name} currentSort={sortConfig} onSort={handleSort} />
                                    <SortableHeader field="school" label={dict.admin.dashboard.details.school} currentSort={sortConfig} onSort={handleSort} />
                                    <SortableHeader field="grade" label={dict.admin.dashboard.details.grade} currentSort={sortConfig} onSort={handleSort} />
                                    {/* <SortableHeader field="status" label={dict.admin.dashboard.details.status} currentSort={sortConfig} onSort={handleSort} /> */}
                                    <SortableHeader field="submissionDate" label={dict.admin.dashboard.details.submissionDate} currentSort={sortConfig} onSort={handleSort} />
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredStudents.map((student) => (
                                    <tr key={student.id} onClick={() => setSelectedStudent(student)} className="hover:bg-gray-50 cursor-pointer">
                                        <td className="px-6 py-4 whitespace-nowrap">{student.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{student.school}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{student.grade}</td>
                                        {/* <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${student.status === "Approved" ? "bg-green-100 text-green-800" : student.status === "Rejected" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"}`}>{student.status}</span>
                                    </td> */}
                                        <td className="px-6 py-4 whitespace-nowrap">{DateTime.fromISO(student.submissionDate).toFormat("dd LLL, yyyy")}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <StudentDetailModal student={selectedStudent} isOpen={!!selectedStudent} onClose={() => setSelectedStudent(null)} dict={dict} />
        </div>
    );
}
