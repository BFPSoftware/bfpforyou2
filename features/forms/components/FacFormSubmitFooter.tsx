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
        <div className="mt-6">
            {validationError && <div className="text-red-500 text-sm mb-2">{validationError}</div>}
            {submitError && <div className="text-red-500 text-sm mb-2">{submitError}</div>}
            {children}
            <FormSubmitButton label={submitLabel} isSubmitting={isLoading} disabled={isLoading} />
        </div>
    );
};

export default FacFormSubmitFooter;
