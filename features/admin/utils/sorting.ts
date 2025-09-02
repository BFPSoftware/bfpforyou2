import { Student } from "@/types/student";

export type SortField = "name" | "school" | "grade" | "status" | "submissionDate";
export type SortDirection = "asc" | "desc" | null;

export interface SortConfig {
    field: SortField;
    direction: SortDirection;
}

export function sortStudents(students: Student[], sortConfig: SortConfig | null): Student[] {
    if (!sortConfig || !sortConfig.direction) {
        // Default sort by submission date, newest first
        return [...students].sort((a, b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime());
    }

    const { field, direction } = sortConfig;

    return [...students].sort((a, b) => {
        let comparison = 0;

        switch (field) {
            case "submissionDate":
                comparison = new Date(a.submissionDate).getTime() - new Date(b.submissionDate).getTime();
                break;
            case "name":
            case "school":
            case "grade":
            case "status":
                comparison = a[field].localeCompare(b[field]);
                break;
            default:
                comparison = 0;
        }

        return direction === "asc" ? comparison : -comparison;
    });
}
