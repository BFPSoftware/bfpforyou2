import { FC, ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";

type FormSubmitButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    label: string;
    isSubmitting?: boolean;
    submittingLabel?: string;
};

const FormSubmitButton: FC<FormSubmitButtonProps> = ({
    label,
    isSubmitting = false,
    submittingLabel = "Submitting…",
    disabled,
    className = "",
    ...props
}) => {
    return (
        <button
            type="submit"
            disabled={disabled || isSubmitting}
            aria-busy={isSubmitting}
            className={`btn-theme min-h-[44px] min-w-[44px] disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
            {...props}
        >
            {isSubmitting ? (
                <span className="inline-flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin" size={18} />
                    {submittingLabel}
                </span>
            ) : (
                label
            )}
        </button>
    );
};

export default FormSubmitButton;
