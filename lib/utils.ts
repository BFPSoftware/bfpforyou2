import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { uploadFile } from "@/app/[lang]/actions/kintone/uploadFile";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export type FileWithMeta = {
    file?: File;
    fileKey: string;
    uploadedAt?: Date;
} | null;

export const checkAndReuploadFile = async (attachment: FileWithMeta) => {
    if (!attachment?.fileKey || !attachment.uploadedAt || !attachment.file) return attachment;

    const expirationDate = new Date(attachment.uploadedAt);
    expirationDate.setDate(expirationDate.getDate() + 3);

    if (new Date() > expirationDate) {
        // Re-upload the file since it's expired
        const res = await uploadFile({ file: attachment.file });
        if (res?.data?.success) {
            return {
                ...attachment,
                fileKey: res.data.success,
                uploadedAt: new Date(),
            };
        }
    }
    return attachment;
};
