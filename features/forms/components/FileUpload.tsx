import { uploadFile } from "@/app/[lang]/actions/kintone/uploadFile";
import { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import { FieldError, FieldErrorsImpl, Merge, UseFormWatch } from "react-hook-form";
import { Upload } from "lucide-react";
import Delete from "@/components/icons/Delete";

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
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (error?.message) setIsError({ message: error.message });
    }, [error?.message]);

    useEffect(() => {
        if (watch?.file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFilePreview(reader.result);
            };
            reader.readAsDataURL(watch.file);
        }
    }, [watch?.file]);

    useEffect(() => {
        // Check for file expiration
        if (watch?.fileKey && watch?.uploadedAt && !watch?.file) {
            const expirationDate = new Date(watch.uploadedAt);
            expirationDate.setDate(expirationDate.getDate() + 3);
            if (new Date() > expirationDate) {
                setIsError({ message: "File has expired. Please upload again." });
                setValue(field, null);
            }
        }
    }, [watch?.fileKey, watch?.uploadedAt, watch?.file]);

    // store the file key after uploading unto Kintone
    const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        if (isError.message) setIsError({ message: "" });
        const files = e.target.files;
        if (!files?.length) return "could not read files";
        if (files.length > 0) {
            const file = files[0];
            if (file) {
                if (file.size > 10 * 1024 * 1024) {
                    // 10MB max
                    setIsError({ message: "File size should be 10MB or less." });
                    return;
                } else {
                    setIsError({ message: "" });
                }
                const res = await uploadFile({ file });
                // TODO: error handling
                // if no res clear input value
                const handleFailureUpload = () => {
                    setIsError({ message: "Could not upload file. Try again" });
                    setValue(field, null);
                    inputRef.current?.value && (inputRef.current.value = "");
                };
                if (res?.serverError) handleFailureUpload();
                else if (res?.validationErrors) setValue(field, null);
                else if (res?.data?.failure) handleFailureUpload();
                else if (res?.data?.success) {
                    setIsError({ message: "" });
                    setValue(field, {
                        file: file,
                        fileKey: res?.data?.success,
                        uploadedAt: new Date(),
                    });
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        setFilePreview(reader.result);
                    };
                    reader.readAsDataURL(file);
                }
            }
        }
    };

    return (
        <div className="flex flex-col w-full space-y-1 py-3 grow md:max-w-sm">
            <div className="font-semibold mb-1">{label}</div>
            <input accept="image/*, .pdf, .doc, .docx" ref={inputRef} capture={"environment"} onInputCapture={handleUpload} type="file" className="hidden" />
            {/* custom upload button and preview and file name to display */}
            <div className="">
                <button
                    name={field} // for form validation scrollIntoView
                    type="button"
                    className="bg-primary text-white px-4 py-2 hover:opacity-80 rounded-full w-40 flex justify-center font-bold"
                    onClick={() => {
                        inputRef.current?.click();
                    }}
                >
                    <Upload className="mx-2" />
                    Upload
                </button>
            </div>
            {filePreview && (
                <div className="flex items-center space-x-2">
                    <div>
                        <img src={filePreview} alt="file preview" className="max-w-40 max-h-40" />
                        <div className="text-xs max-w-40 text-ellipsis overflow-hidden whitespace-nowrap">{watch?.file?.name}</div>
                    </div>
                    {/* delete image button */}
                    <span
                        onClick={() => {
                            setFilePreview(null);
                            setValue(field, null);
                        }}
                        className="cursor-pointer hover:scale-110 text-red-500"
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
