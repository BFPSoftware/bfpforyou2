import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { uploadFileToKintone } from "@/lib/kintone-client-upload";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export type FileWithMeta = {
    file?: File;
    fileKey: string;
    uploadedAt?: Date;
} | null;

/**
 * Check if a file attachment has expired (more than 3 days old)
 */
export const isFileExpired = (uploadedAt?: Date): boolean => {
    if (!uploadedAt) return false;
    const expirationDate = new Date(uploadedAt);
    expirationDate.setDate(expirationDate.getDate() + 3);
    return new Date() > expirationDate;
};

/**
 * True when the upload expired and the original File is no longer available for auto re-upload.
 * A fresh upload with only `fileKey` + `uploadedAt` is valid until expiry.
 */
export const isFileLost = (attachment: FileWithMeta): boolean => {
    if (!attachment?.fileKey || !attachment.uploadedAt) return false;
    return !attachment.file && isFileExpired(attachment.uploadedAt);
};

/**
 * Check if a file attachment needs re-upload (Kintone file keys expire after ~3 days).
 */
export const needsReupload = (attachment: FileWithMeta): boolean => {
    if (!attachment?.fileKey || !attachment.uploadedAt) return false;
    return isFileExpired(attachment.uploadedAt);
};

/**
 * Re-upload a file if it's expired. Returns the updated attachment or null if re-upload failed.
 * If file object is missing, returns null to indicate file needs to be re-uploaded by user.
 */
export const checkAndReuploadFile = async (attachment: FileWithMeta): Promise<FileWithMeta> => {
    if (!attachment?.fileKey || !attachment.uploadedAt) return attachment;

    // If file object is missing, we can't re-upload - user needs to upload again
    if (!attachment.file) {
        // Check if it's expired - if so, return null to force re-upload
        if (isFileExpired(attachment.uploadedAt)) {
            return null;
        }
        return attachment;
    }

    // Check if expired and re-upload if needed
    if (isFileExpired(attachment.uploadedAt)) {
        try {
            const { fileKey } = await uploadFileToKintone(attachment.file);
            return {
                ...attachment,
                fileKey,
                uploadedAt: new Date(),
            };
        } catch (error) {
            // Re-upload failed - return null to indicate error
            return null;
        }
    }
    
    return attachment;
};
