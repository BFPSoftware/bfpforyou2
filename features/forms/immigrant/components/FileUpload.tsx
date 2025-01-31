import { ChangeEvent, FC } from 'react';
import { FieldError } from 'react-hook-form';

type FileUploadProps = {
    label: string;
    setValue: any;
    field: string;
    error: FieldError | undefined;
};
const FileUpload: FC<FileUploadProps> = ({ label, setValue, field, error }) => {
    // store the file key after uploading unto Kintone
    const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files?.length) return 'could not read files';
        if (files.length > 0) {
            const file = files[0];
            const formData = new FormData();
            formData.append('file', file);
            console.log('file', file);
            await fetch('/api/kintone/uploadFileKintone', {
                method: 'POST',
                body: formData
            })
                .then((res) => res.json())
                .then((data) => {
                    setValue(field, data.res);
                    console.log(data.res);
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    };
    return (
        <>
            <input className="hidden" />
            <label className="flex flex-col w-full space-y-1 me-5 grow md:max-w-sm">
                <div className="font-semibold mb-1">{label}</div>
                <input onInputCapture={handleUpload} type="file" className="" />
                {error && <div className="text-red-500 pl-1 pt-1 text-xs">{error.message}</div>}
            </label>
        </>
    );
};
export default FileUpload;
