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
 * Check if a file attachment is lost (has fileKey but no file object)
 */
export const isFileLost = (attachment: FileWithMeta): boolean => {
    return !!(attachment?.fileKey && !attachment?.file);
};

/**
 * Check if a file attachment needs re-upload (expired or lost)
 */
export const needsReupload = (attachment: FileWithMeta): boolean => {
    if (!attachment?.fileKey || !attachment.uploadedAt) return false;
    
    // File is lost (fileKey exists but file object is missing)
    if (isFileLost(attachment)) return true;
    
    // File is expired
    if (isFileExpired(attachment.uploadedAt)) return true;
    
    return false;
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
            const res = await uploadFile({ file: attachment.file });
            if (res?.data?.success) {
                return {
                    ...attachment,
                    fileKey: res.data.success,
                    uploadedAt: new Date(),
                };
            } else {
                // Re-upload failed - return null to indicate error
                return null;
            }
        } catch (error) {
            // Re-upload failed - return null to indicate error
            return null;
        }
    }
    
    return attachment;
};
