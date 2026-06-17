import { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import { FieldError, FieldErrorsImpl, Merge, UseFormWatch } from "react-hook-form";
import { Upload, Loader2, Info } from "lucide-react";
import Delete from "@/components/icons/Delete";
import { isFileExpired } from "@/lib/utils";
import {
    FileTooLargeError,
    HeicConversionError,
    ImageProcessingError,
    InvalidFileTypeError,
    KintoneUploadError,
    uploadFileToKintone,
} from "@/lib/kintone-client-upload";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

type FileUploadProps = {
    label: string;
    setValue: any;
    watch: { file?: File; fileKey: string; uploadedAt?: Date } | null | undefined;
    field: string;
    error: Merge<FieldError, FieldErrorsImpl<{ fileKey: string; file: File; uploadedAt: Date }>> | undefined;
    info?: {
        title: string;
        description?: string;
        imageSrc?: string;
    };
    /** Red asterisk next to label only; does not enforce validation by itself. */
    showRequiredAsterisk?: boolean;
    /** When true, error copy notes the form may be submitted without a photo. */
    photoOptional?: boolean;
};

const uploadFailedMessage = (photoOptional: boolean) =>
    photoOptional
        ? "Image could not be uploaded. You can continue and submit the form without a photo."
        : "Image could not be uploaded. Please try again.";

const FileUpload: FC<FileUploadProps> = ({
    label,
    setValue,
    watch,
    field,
    error,
    info,
    showRequiredAsterisk,
    photoOptional = false,
}) => {
    const [isError, setIsError] = useState<{ message: string }>({ message: error?.message || "" });
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const previewUrlRef = useRef<string | null>(null);

    const clearPreviewUrl = () => {
        if (previewUrlRef.current) {
            URL.revokeObjectURL(previewUrlRef.current);
            previewUrlRef.current = null;
        }
    };

    const setPreviewFromFile = (file: File) => {
        clearPreviewUrl();
        previewUrlRef.current = URL.createObjectURL(file);
        setFilePreview(previewUrlRef.current);
    };

    useEffect(() => {
        return () => clearPreviewUrl();
    }, []);

    useEffect(() => {
        if (error?.message) setIsError({ message: error.message });
    }, [error?.message]);

    useEffect(() => {
        // Only clear on expiry — fileKey alone is valid (File objects are not kept in form state).
        if (!watch?.fileKey || !watch.uploadedAt) return;
        if (isFileExpired(watch.uploadedAt)) {
            setIsError({ message: "File has expired. Please re-upload the file." });
            setValue(field, null);
            clearPreviewUrl();
            setFilePreview(null);
            setSelectedFile(null);
        }
    }, [watch?.fileKey, watch?.uploadedAt, field, setValue]);

    const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        if (isError.message) setIsError({ message: "" });

        const files = e.target.files;
        if (!files?.length) return;

        const file = files[0];
        if (!file) return;

        if (file.size > 50 * 1024 * 1024) {
            setIsError({ message: "File size should be 50MB or less." });
            if (inputRef.current) inputRef.current.value = "";
            return;
        }

        setIsError({ message: "" });
        setSelectedFile(file);

        try {
            setPreviewFromFile(file);
        } catch {
            // Preview is optional; upload can still proceed.
            setFilePreview(null);
        }

        setIsUploading(true);
        try {
            const { fileKey } = await uploadFileToKintone(file);
            setIsError({ message: "" });
            // Store fileKey only — keeping File in RHF state is unreliable and triggered false "file lost" clears.
            setValue(field, {
                fileKey,
                uploadedAt: new Date(),
            });
        } catch (error) {
            console.error("[FileUpload] Upload failed:", error instanceof Error ? error.message : error);
            if (error instanceof FileTooLargeError) {
                setIsError({ message: "File size should be 50MB or less." });
            } else if (error instanceof HeicConversionError) {
                setIsError({ message: error.message });
            } else if (error instanceof InvalidFileTypeError) {
                const isSvg =
                    error.mimeType.includes("svg") ||
                    (selectedFile?.name || "").toLowerCase().endsWith(".svg");
                setIsError({
                    message: isSvg
                        ? "SVG is not supported. Please use JPG or PNG."
                        : "Please upload a JPG or PNG photo.",
                });
            } else if (error instanceof ImageProcessingError) {
                setIsError({ message: uploadFailedMessage(photoOptional) });
            } else if (error instanceof KintoneUploadError) {
                setIsError({ message: uploadFailedMessage(photoOptional) });
            } else {
                setIsError({ message: uploadFailedMessage(photoOptional) });
            }
            setValue(field, null);
            clearPreviewUrl();
            setFilePreview(null);
            setSelectedFile(null);
        } finally {
            setIsUploading(false);
            if (inputRef.current) inputRef.current.value = "";
        }
    };

    const hasUploaded = Boolean(watch?.fileKey);

    return (
        <div className="flex flex-col w-full space-y-1 py-3 grow md:max-w-sm">
            <div className="font-semibold mb-1 flex items-center gap-2 flex-wrap">
                <span>
                    {label}
                    {showRequiredAsterisk && <span className="text-red-500">*</span>}
                </span>
                {info && (
                    <Dialog>
                        <DialogTrigger asChild>
                            <button
                                type="button"
                                aria-label="Photo requirements"
                                className="inline-flex items-center justify-center rounded-full p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition"
                            >
                                <Info size={16} />
                            </button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>{info.title}</DialogTitle>
                                {info.description && <DialogDescription>{info.description}</DialogDescription>}
                            </DialogHeader>
                            {info.imageSrc && (
                                <div className="w-full">
                                    <img
                                        src={info.imageSrc}
                                        alt="Headshot example"
                                        className="w-full h-auto rounded-md border"
                                    />
                                </div>
                            )}
                        </DialogContent>
                    </Dialog>
                )}
            </div>
            <input
                ref={inputRef}
                onChange={(event) => {
                    void handleUpload(event);
                }}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,.heic,.heif"
                className="hidden"
            />
            <div className="">
                <button
                    name={field}
                    type="button"
                    disabled={isUploading}
                    className={`bg-primary text-white px-4 py-2 rounded-full w-40 flex justify-center font-bold ${
                        isUploading ? "opacity-50 cursor-not-allowed" : "hover:opacity-80"
                    }`}
                    onClick={() => {
                        if (!isUploading) {
                            inputRef.current?.click();
                        }
                    }}
                >
                    {isUploading ? (
                        <>
                            <Loader2 className="mx-2 animate-spin" />
                            Uploading...
                        </>
                    ) : (
                        <>
                            <Upload className="mx-2" />
                            Upload
                        </>
                    )}
                </button>
            </div>
            {filePreview && (
                <div className="flex items-center space-x-2">
                    <div className="relative">
                        <img src={filePreview} alt="file preview" className="max-w-40 max-h-40" />
                        {isUploading && (
                            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center rounded">
                                <Loader2 className="animate-spin text-white" size={24} />
                            </div>
                        )}
                        <div className="text-xs max-w-40 text-ellipsis overflow-hidden whitespace-nowrap">
                            {selectedFile?.name || watch?.file?.name}
                        </div>
                    </div>
                    <span
                        onClick={() => {
                            if (!isUploading) {
                                clearPreviewUrl();
                                setFilePreview(null);
                                setSelectedFile(null);
                                setValue(field, null);
                                if (inputRef.current) {
                                    inputRef.current.value = "";
                                }
                            }
                        }}
                        className={`cursor-pointer hover:scale-110 text-red-500 ${
                            isUploading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                    >
                        <Delete />
                    </span>
                </div>
            )}
            {!filePreview && hasUploaded && !isUploading && (
                <div className="text-xs text-green-700 pl-1">Photo uploaded</div>
            )}
            {isError.message && <div className="text-red-500 pl-1 pt-1 text-xs">{isError.message}</div>}
        </div>
    );
};

export default FileUpload;
