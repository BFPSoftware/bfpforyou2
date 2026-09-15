import { REST_BeneficiaryApplicationForm } from "@/types/BeneficiaryApplicationForm";
import { KintoneRecordField } from "@kintone/rest-api-client";

export type ImmigrantApplication = REST_BeneficiaryApplicationForm & {
    $id: KintoneRecordField.ID;
    Created_datetime: KintoneRecordField.CreatedTime;
    reviewerNotes?: KintoneRecordField.MultiLineText;
};

export type ImmigrantSortField = "name" | "ticket" | "city" | "aliyahDate" | "createdDateTime" | "status";
export type SortDirection = "asc" | "desc" | null;

export interface ImmigrantSortConfig {
    field: ImmigrantSortField;
    direction: SortDirection;
}

export function sortImmigrantApplications(
    applications: ImmigrantApplication[],
    sortConfig: ImmigrantSortConfig | null
): ImmigrantApplication[] {
    if (!sortConfig || !sortConfig.direction) {
        return [...applications].sort(
            (a, b) => new Date(b.Created_datetime.value).getTime() - new Date(a.Created_datetime.value).getTime()
        );
    }

    const { field, direction } = sortConfig;

    return [...applications].sort((a, b) => {
        let comparison = 0;

        switch (field) {
            case "createdDateTime":
                comparison =
                    new Date(a.Created_datetime.value).getTime() - new Date(b.Created_datetime.value).getTime();
                break;
            case "name":
                comparison = `${a.firstName.value} ${a.lastName.value}`.localeCompare(
                    `${b.firstName.value} ${b.lastName.value}`
                );
                break;
            case "ticket":
                comparison = (a.ticket?.value || "").localeCompare(b.ticket?.value || "");
                break;
            case "city":
                comparison = (a.addressCity?.value || "").localeCompare(b.addressCity?.value || "");
                break;
            case "aliyahDate":
                comparison = (a.aliyahDate?.value || "").localeCompare(b.aliyahDate?.value || "");
                break;
            case "status":
                comparison = String((a as { localStatus?: string }).localStatus || a.status?.value || "").localeCompare(
                    String((b as { localStatus?: string }).localStatus || b.status?.value || "")
                );
                break;
            default:
                comparison = 0;
        }

        return direction === "asc" ? comparison : -comparison;
    });
}
