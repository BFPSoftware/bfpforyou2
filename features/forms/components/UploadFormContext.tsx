"use client";

import { createContext, FC, ReactNode, useCallback, useContext, useMemo, useState } from "react";

type UploadFormContextValue = {
    isAnyUploading: boolean;
    setFieldUploading: (field: string, uploading: boolean) => void;
};

const UploadFormContext = createContext<UploadFormContextValue | null>(null);

export const UploadFormProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [uploadingFields, setUploadingFields] = useState<Record<string, boolean>>({});

    const setFieldUploading = useCallback((field: string, uploading: boolean) => {
        setUploadingFields((prev) => {
            if (uploading) return { ...prev, [field]: true };
            const next = { ...prev };
            delete next[field];
            return next;
        });
    }, []);

    const isAnyUploading = useMemo(() => Object.values(uploadingFields).some(Boolean), [uploadingFields]);

    const value = useMemo(() => ({ isAnyUploading, setFieldUploading }), [isAnyUploading, setFieldUploading]);

    return <UploadFormContext.Provider value={value}>{children}</UploadFormContext.Provider>;
};

export function useUploadFormContext(): UploadFormContextValue {
    const ctx = useContext(UploadFormContext);
    if (!ctx) {
        return {
            isAnyUploading: false,
            setFieldUploading: () => {},
        };
    }
    return ctx;
}
