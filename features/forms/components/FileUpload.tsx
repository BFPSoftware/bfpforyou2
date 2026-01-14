import { uploadFile } from "@/app/[lang]/actions/kintone/uploadFile";
import { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import { FieldError, FieldErrorsImpl, Merge, UseFormWatch } from "react-hook-form";
import { Upload, Loader2 } from "lucide-react";
import Delete from "@/components/icons/Delete";
import { isFileExpired, isFileLost } from "@/lib/utils";

type FileUploadProps = {
    label: string;
    setValue: any;
    watch: { file?: File; fileKey: string; uploadedAt?: Date } | null;
    field: string;
    error: Merge<FieldError, FieldErrorsImpl<{ fileKey: string; file: File; uploadedAt: Date }>> | undefined;
};

const FileUpload: FC<FileUploadProps> = ({ label, setValue, watch, field, error }) => {
    const [isError, setIsError] = useState<{ message: string }>({ message: error?.message || "" });
    const [filePreview, setFilePreview] = useState<any>();
    const [isUploading, setIsUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (error?.message) setIsError({ message: error.message });
    }, [error?.message]);

    useEffect(() => {
        // Show preview from form state if file exists and we're not in the middle of uploading
        if (watch?.file && !isUploading) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFilePreview(reader.result);
            };
            reader.readAsDataURL(watch.file);
        }
    }, [watch?.file, isUploading]);

    useEffect(() => {
        // Check if file is missing or expired
        if (watch?.fileKey) {
            if (isFileLost(watch)) {
                // File is lost (fileKey exists but file object is missing)
                if (watch.uploadedAt && isFileExpired(watch.uploadedAt)) {
                    setIsError({ message: "File has expired. Please re-upload the file." });
                    setValue(field, null);
                } else {
                    setIsError({ message: "File is missing. Please upload." });
                    setValue(field, null);
                }
            }
            // Note: If file exists but is expired, we don't show an error here
            // because it will be automatically re-uploaded on submit
        }
    }, [watch?.fileKey, watch?.file, watch?.uploadedAt, field, setValue]);

    // store the file key after uploading unto Kintone
    const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        if (isError.message) setIsError({ message: "" });
        const files = e.target.files;
        if (!files?.length) return "could not read files";
        if (files.length > 0) {
            const file = files[0];
            if (file) {
                // Validate file size first
                if (file.size > 10 * 1024 * 1024) {
                    // 10MB max
                    setIsError({ message: "File size should be 10MB or less." });
                    inputRef.current && (inputRef.current.value = "");
                    return;
                }

                // Clear any previous errors
                setIsError({ message: "" });
                setSelectedFile(file);

                // Show preview immediately after file selection (before upload)
                const reader = new FileReader();
                reader.onloadend = () => {
                    setFilePreview(reader.result);
                };
                reader.readAsDataURL(file);

                // Start upload process
                setIsUploading(true);
                try {
                    const res = await uploadFile({ file });
                    
                    if (res?.serverError) {
                        setIsError({ message: "Could not upload file. Try again" });
                        setIsUploading(false);
                        // Keep preview so user can see what they selected and retry
                    } else if (res?.validationErrors) {
                        setIsError({ message: "File validation failed. Please try again." });
                        setIsUploading(false);
                    } else if (res?.data?.failure) {
                        setIsError({ message: "Could not upload file. Try again" });
                        setIsUploading(false);
                        // Keep preview so user can see what they selected and retry
                    } else if (res?.data?.success) {
                        // Upload successful - update form value with fileKey
                        setIsError({ message: "" });
                        setValue(field, {
                            file: file,
                            fileKey: res.data.success,
                            uploadedAt: new Date(),
                        });
                        setIsUploading(false);
                    } else {
                        // Unexpected response
                        setIsError({ message: "Upload failed. Please try again." });
                        setIsUploading(false);
                    }
                } catch (error) {
                    // Handle unexpected errors
                    setIsError({ message: "An error occurred during upload. Please try again." });
                    setIsUploading(false);
                } finally {
                    // Clear input value to allow re-selecting the same file if needed
                    if (inputRef.current) {
                        inputRef.current.value = "";
                    }
                }
            }
        }
    };

    return (
        <div className="flex flex-col w-full space-y-1 py-3 grow md:max-w-sm">
            <div className="font-semibold mb-1">{label}</div>
            {/* TODO: review accept file types */}
            <input ref={inputRef} onChange={handleUpload} type="file" className="hidden" />
            {/* custom upload button and preview and file name to display */}
            <div className="">
                <button
                    name={field} // for form validation scrollIntoView
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
                    {/* delete image button - disabled during upload */}
                    <span
                        onClick={() => {
                            if (!isUploading) {
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
            {isError.message && <div className="text-red-500 pl-1 pt-1 text-xs">{isError?.message}</div>}
        </div>
    );
};

export default FileUpload;
