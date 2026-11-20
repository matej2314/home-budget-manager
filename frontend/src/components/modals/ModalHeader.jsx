import { Icon } from '@iconify/react';

/** Wspólny nagłówek modali — tytuł + opcjonalny podtytuł + zamknięcie. */
export default function ModalHeader({ title, subtitle, onClose }) {
    return (
        <div className="flex items-start justify-between gap-3 mb-5">
            <div className="min-w-0">
                <h2 className="text-lg sm:text-xl font-semibold text-ink">{title}</h2>
                {subtitle ? (
                    <div className="mt-1 text-sm text-muted">{subtitle}</div>
                ) : null}
            </div>
            {onClose ? (
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close"
                    className="shrink-0 p-1.5 rounded-lg text-muted hover:text-ink hover:bg-page transition-colors"
                >
                    <Icon icon="mdi:close" width={20} height={20} />
                </button>
            ) : null}
        </div>
    );
}
