"use client";

import { createContext, FC, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import logError from "@/common/logError";

const WATCHDOG_MS = 120_000;

type UploadFieldState = {
    uploading: boolean;
    startedAt: number;
};

type UploadFormContextValue = {
    isAnyUploading: boolean;
    setFieldUploading: (field: string, uploading: boolean) => void;
    forceClearField: (field: string, reason: string) => void;
};

const UploadFormContext = createContext<UploadFormContextValue | null>(null);

export const UploadFormProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [uploadingFields, setUploadingFields] = useState<Record<string, UploadFieldState>>({});
    const fieldsRef = useRef(uploadingFields);
    fieldsRef.current = uploadingFields;

    const setFieldUploading = useCallback((field: string, uploading: boolean) => {
        setUploadingFields((prev) => {
            if (uploading) {
                return { ...prev, [field]: { uploading: true, startedAt: Date.now() } };
            }
            const next = { ...prev };
            delete next[field];
            return next;
        });
    }, []);

    const forceClearField = useCallback((field: string, reason: string) => {
        setUploadingFields((prev) => {
            if (!prev[field]) return prev;
            void logError(new Error(reason), { field }, "UploadFormContext.watchdog");
            const next = { ...prev };
            delete next[field];
            return next;
        });
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now();
            for (const [field, state] of Object.entries(fieldsRef.current)) {
                if (state.uploading && now - state.startedAt > WATCHDOG_MS) {
                    forceClearField(field, "Upload watchdog cleared stuck field");
                }
            }
        }, 10_000);
        return () => clearInterval(interval);
    }, [forceClearField]);

    const isAnyUploading = useMemo(
        () => Object.values(uploadingFields).some((s) => s.uploading),
        [uploadingFields]
    );

    const value = useMemo(
        () => ({ isAnyUploading, setFieldUploading, forceClearField }),
        [isAnyUploading, setFieldUploading, forceClearField]
    );

    return <UploadFormContext.Provider value={value}>{children}</UploadFormContext.Provider>;
};

export function useUploadFormContext(): UploadFormContextValue {
    const ctx = useContext(UploadFormContext);
    if (!ctx) {
        return {
            isAnyUploading: false,
            setFieldUploading: () => {},
            forceClearField: () => {},
        };
    }
    return ctx;
}
