import { FC, ReactNode } from "react";
import FormSubmitButton from "./FormSubmitButton";

type FacFormSubmitFooterProps = {
    submitLabel: string;
    isLoading: boolean;
    submitError?: string;
    validationError?: string;
    children?: ReactNode;
};

const FacFormSubmitFooter: FC<FacFormSubmitFooterProps> = ({
    submitLabel,
    isLoading,
    submitError,
    validationError,
    children,
}) => {
    return (
        <div className="sticky bottom-0 z-10 -mx-[5%] md:-mx-[10%] px-[5%] md:px-[10%] mt-6 bg-white/95 backdrop-blur border-t border-slate-200 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
            {validationError && <div className="text-red-500 text-sm mb-2">{validationError}</div>}
            {submitError && <div className="text-red-500 text-sm mb-2">{submitError}</div>}
            {children}
            <FormSubmitButton label={submitLabel} isSubmitting={isLoading} disabled={isLoading} />
        </div>
    );
};

export default FacFormSubmitFooter;
