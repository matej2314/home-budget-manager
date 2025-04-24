import { type ReactNode } from "react";

interface SubmitBtnProps {
    className: string;
    children: ReactNode;
    disabled: boolean;
    onClick?: () => void;
};

export default function SubmitBtn({ className, children, disabled, onClick }: SubmitBtnProps) {

    return (
        <button
            type="submit"
            className={className}
            disabled={disabled}
            onClick={onClick}
        >
            {children}
        </button>
    )
}