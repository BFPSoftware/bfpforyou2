import { ChangeEvent, FC, useCallback, useEffect, useRef, useState } from "react";
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
    UploadPhase,
    UploadTimeoutError,
    uploadFileToKintone,
} from "@/lib/kintone-client-upload";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useUploadFormContext } from "./UploadFormContext";
import logError from "@/common/logError";

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
    /** When true, error copy notes the form may be submitted without this file. */
    photoOptional?: boolean;
    /** Alias for photoOptional — used for immigrant attachments. */
    fieldOptional?: boolean;
    /** Label for success state; defaults based on fieldOptional. */
    successLabel?: string;
};

const uploadFailedMessage = (optional: boolean) =>
    optional
        ? "File could not be uploaded. You can continue and submit the form without this file."
        : "File could not be uploaded. Please try again.";

const phaseLabel = (phase: UploadPhase): string => {
    switch (phase) {
        case "converting":
            return "Converting…";
        case "compressing":
            return "Compressing…";
        case "uploading":
            return "Uploading…";
    }
};

const FileUpload: FC<FileUploadProps> = ({
    label,
    setValue,
    watch,
    field,
    error,
    info,
    showRequiredAsterisk,
    photoOptional = false,
    fieldOptional,
    successLabel,
}) => {
    const isOptional = fieldOptional ?? photoOptional;
    const uploadedLabel = successLabel ?? (isOptional ? "File uploaded" : "Photo uploaded");

    const [isError, setIsError] = useState<{ message: string }>({ message: error?.message || "" });
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadPhase, setUploadPhase] = useState<UploadPhase | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const previewUrlRef = useRef<string | null>(null);
    const uploadStartedAtRef = useRef<number | null>(null);
    const { setFieldUploading } = useUploadFormContext();

    const resetUploadUi = useCallback(
        (message?: string) => {
            setIsUploading(false);
            setUploadPhase(null);
            if (message) setIsError({ message });
            clearPreviewUrl();
            setFilePreview(null);
            setSelectedFile(null);
            if (inputRef.current) inputRef.current.value = "";
        },
        []
    );

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
        setFieldUploading(field, isUploading);
        return () => setFieldUploading(field, false);
    }, [field, isUploading, setFieldUploading]);

    useEffect(() => {
        if (error?.message) setIsError({ message: error.message });
    }, [error?.message]);

    useEffect(() => {
        if (!watch?.fileKey || !watch.uploadedAt) return;
        if (isFileExpired(watch.uploadedAt)) {
            setIsError({ message: "File has expired. Please re-upload the file." });
            setValue(field, null);
            clearPreviewUrl();
            setFilePreview(null);
            setSelectedFile(null);
        }
    }, [watch?.fileKey, watch?.uploadedAt, field, setValue]);

    useEffect(() => {
        const onVisibilityChange = () => {
            if (document.hidden || !isUploading) return;
            const started = uploadStartedAtRef.current;
            if (started && Date.now() - started > 90_000) {
                resetUploadUi(uploadFailedMessage(isOptional));
                setValue(field, null);
            }
        };
        document.addEventListener("visibilitychange", onVisibilityChange);
        return () => document.removeEventListener("visibilitychange", onVisibilityChange);
    }, [field, isOptional, isUploading, resetUploadUi, setValue]);

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
            setFilePreview(null);
        }

        setIsUploading(true);
        setUploadPhase("compressing");
        uploadStartedAtRef.current = Date.now();
        try {
            const { fileKey } = await uploadFileToKintone(file, (phase) => setUploadPhase(phase));
            setIsError({ message: "" });
            setValue(field, {
                fileKey,
                uploadedAt: new Date(),
            });
        } catch (error) {
            void logError(
                error,
                {
                    field,
                    fileName: file.name,
                    fileSize: file.size,
                    fileType: file.type || resolveMimeFromName(file.name),
                    errorName: error instanceof Error ? error.name : "unknown",
                },
                "FileUpload"
            );

            if (error instanceof FileTooLargeError) {
                setIsError({ message: "File size should be 50MB or less." });
            } else if (error instanceof HeicConversionError) {
                setIsError({ message: error.message });
            } else if (error instanceof InvalidFileTypeError) {
                const isSvg =
                    error.mimeType.includes("svg") || file.name.toLowerCase().endsWith(".svg");
                setIsError({
                    message: isSvg
                        ? "SVG is not supported. Please use JPG or PNG."
                        : "Please upload a JPG or PNG image.",
                });
            } else if (error instanceof ImageProcessingError) {
                setIsError({ message: uploadFailedMessage(isOptional) });
            } else if (error instanceof UploadTimeoutError) {
                setIsError({ message: error.message });
            } else if (error instanceof KintoneUploadError) {
                setIsError({ message: uploadFailedMessage(isOptional) });
            } else {
                setIsError({ message: uploadFailedMessage(isOptional) });
            }
            setValue(field, null);
            clearPreviewUrl();
            setFilePreview(null);
            setSelectedFile(null);
        } finally {
            uploadStartedAtRef.current = null;
            setIsUploading(false);
            setUploadPhase(null);
            if (inputRef.current) inputRef.current.value = "";
        }
    };

    const hasUploaded = Boolean(watch?.fileKey);
    const buttonLabel = isUploading && uploadPhase ? phaseLabel(uploadPhase) : "Upload";

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
                                aria-label="File requirements"
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
                                        alt="Example"
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
                            {buttonLabel}
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
                <div className="text-xs text-green-700 pl-1">{uploadedLabel}</div>
            )}
            {isError.message && <div className="text-red-500 pl-1 pt-1 text-xs">{isError.message}</div>}
        </div>
    );
};

function resolveMimeFromName(name: string): string {
    const lower = name.toLowerCase();
    if (/\.(jpe?g)$/.test(lower)) return "image/jpeg";
    if (lower.endsWith(".png")) return "image/png";
    if (lower.endsWith(".heic")) return "image/heic";
    return "";
}

export default FileUpload;
