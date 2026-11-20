import AppModal from './AppModal';
import ModalHeader from './ModalHeader';
import { useTranslation } from 'react-i18next'

export default function CalendarModal({ selectedEvent, handleCloseModal }) {
    const { t } = useTranslation("modals");

    return (
        <AppModal
            isOpen={!!selectedEvent}
            onRequestClose={handleCloseModal}
            contentLabel={t("calendar.heading")}
            className="modal-panel max-w-md"
        >
            {selectedEvent && (
                <>
                    <ModalHeader title={t("calendar.heading")} onClose={handleCloseModal} />
                    <dl className="flex flex-col gap-3 text-sm text-ink">
                        <div>
                            <dt className="text-muted font-medium">{t("calendar.category")}</dt>
                            <dd className="mt-0.5 font-semibold">{selectedEvent.details.categoryName}</dd>
                        </div>
                        <div>
                            <dt className="text-muted font-medium">{t("calendar.type")}</dt>
                            <dd className="mt-0.5 font-semibold">{selectedEvent.details.type}</dd>
                        </div>
                        <div>
                            <dt className="text-muted font-medium">{t("calendar.value")}</dt>
                            <dd className="mt-0.5 font-semibold">{selectedEvent.details.value}</dd>
                        </div>
                        <div>
                            <dt className="text-muted font-medium">{t("calendar.user")}</dt>
                            <dd className="mt-0.5 font-semibold">{selectedEvent.details.userName}</dd>
                        </div>
                        <div>
                            <dt className="text-muted font-medium">{t("calendar.date")}</dt>
                            <dd className="mt-0.5 font-semibold">{new Date(selectedEvent.details.addedAt).toLocaleString()}</dd>
                        </div>
                    </dl>
                    <div className="modal-actions">
                        <button
                            onClick={handleCloseModal}
                            className="modal-btn-secondary"
                            type="button"
                        >
                            {t("cancel")}
                        </button>
                    </div>
                </>
            )}
        </AppModal>
    )
}
