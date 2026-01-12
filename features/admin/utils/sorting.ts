import { REST_SavedFACApplication } from "@/types/FACApplication";
import { Student } from "@/types/student";

export type SortField = "name" | "school" | "grade" | "createdDateTime";

/**
 * Get the school value based on application type
 * Highschool uses "school" field, Elementary uses "elemSchool" field
 */
function getSchoolValue(response: REST_SavedFACApplication): string {
    if (response.applicationType.value === "Highschool") {
        return response.school?.value || "";
    } else {
        return response.elemSchool?.value || "";
    }
}
export type SortDirection = "asc" | "desc" | null;

export interface SortConfig {
    field: SortField;
    direction: SortDirection;
}

export function sortOriginalResponses(students: REST_SavedFACApplication[], sortConfig: SortConfig | null): REST_SavedFACApplication[] {
    if (!sortConfig || !sortConfig.direction) {
        // Default sort by submission date, newest first
        return [...students].sort((a, b) => new Date(b.Created_datetime.value).getTime() - new Date(a.Created_datetime.value).getTime());
    }

    const { field, direction } = sortConfig;

    return [...students].sort((a, b) => {
        let comparison = 0;

        switch (field) {
            case "createdDateTime":
                comparison = new Date(a.Created_datetime.value).getTime() - new Date(b.Created_datetime.value).getTime();
                break;
            case "name":
                comparison = a.firstName.value.localeCompare(b.firstName.value);
                break;
            case "school":
                comparison = getSchoolValue(a).localeCompare(getSchoolValue(b));
                break;
            case "grade":
                comparison = a.grade.value.localeCompare(b.grade.value);
                break;
            default:
                comparison = 0;
        }

        return direction === "asc" ? comparison : -comparison;
    });
}
