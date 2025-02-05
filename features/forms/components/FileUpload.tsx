import { uploadFile } from "@/app/[lang]/actions/kintone/uploadFile";
import { ChangeEvent, FC, useRef, useState } from "react";
import { FieldError } from "react-hook-form";

type FileUploadProps = {
    label: string;
    setValue: any;
    field: string;
    error: FieldError | undefined;
};
const FileUpload: FC<FileUploadProps> = ({ label, setValue, field, error }) => {
    const [isError, setIsError] = useState<{ message: string }>({ message: error?.message || "" });
    const inputRef = useRef<HTMLInputElement>(null);
    // store the file key after uploading unto Kintone
    const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        if (isError.message) setIsError({ message: "" });
        const files = e.target.files;
        if (!files?.length) return "could not read files";
        if (files.length > 0) {
            const file = files[0];
            const res = await uploadFile({ file });
            console.log("res", res);
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
                setValue(field, res?.data?.success);
            }
        }
    };
    return (
        <>
            <label className="flex flex-col w-full space-y-1 me-5 grow md:max-w-sm">
                <div className="font-semibold mb-1">{label}</div>
                <input ref={inputRef} onInputCapture={handleUpload} type="file" className="" />
                {isError.message && <div className="text-red-500 pl-1 pt-1 text-xs">{isError?.message}</div>}
            </label>
        </>
    );
};
export default FileUpload;
