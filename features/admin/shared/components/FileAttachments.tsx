"use client";

type KintoneFile = {
    fileKey: string;
    name?: string;
    contentType?: string;
    size?: string | number;
};

interface FileAttachmentsProps {
    label: string;
    files?: KintoneFile[] | null;
    missingLabel?: string;
}

function fileUrl(file: KintoneFile) {
    const params = new URLSearchParams({
        fileKey: file.fileKey,
        name: file.name || "file",
        contentType: file.contentType || "application/octet-stream",
    });
    return `/api/admin/download-file?${params.toString()}`;
}

export function FileAttachments({ label, files, missingLabel = "Missing" }: FileAttachmentsProps) {
    const list = files?.filter((f) => f.fileKey) || [];
    const isImage = (ct?: string, name?: string) =>
        Boolean(ct?.startsWith("image/")) || /\.(jpe?g|png|gif|webp|heic)$/i.test(name || "");

    return (
        <div className="col-span-2">
            <h3 className={`font-semibold mb-2 ${list.length === 0 ? "text-amber-800" : ""}`}>
                {label}
                {list.length === 0 && <span className="ml-1 text-xs font-normal text-amber-700">({missingLabel})</span>}
            </h3>
            {list.length === 0 ? (
                <div className="rounded border border-amber-300 bg-amber-50 px-3 py-2 text-amber-900 text-sm">
                    {missingLabel}
                </div>
            ) : (
                <div className="flex flex-wrap gap-3">
                    {list.map((file) => {
                        const url = fileUrl(file);
                        return (
                            <div key={file.fileKey} className="border rounded-md p-2 w-40 bg-gray-50">
                                {isImage(file.contentType, file.name) ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={url}
                                        alt={file.name || label}
                                        className="w-full h-28 object-cover rounded mb-2 bg-white"
                                    />
                                ) : (
                                    <div className="w-full h-28 flex items-center justify-center bg-white rounded mb-2 text-xs text-gray-500">
                                        File
                                    </div>
                                )}
                                <p className="text-xs truncate mb-1" title={file.name}>
                                    {file.name || file.fileKey}
                                </p>
                                <a
                                    href={url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-xs text-blue-600 hover:underline"
                                >
                                    Open / download
                                </a>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
