export default function SubmitBtn({ className, children, disabled, onClick }) {

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