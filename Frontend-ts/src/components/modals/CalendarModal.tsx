import Modal from 'react-modal';
import { useTranslation } from 'react-i18next'
import { type Event } from 'react-big-calendar';
import { Transaction } from '@models/transactionsStoreTypes';

type SelectedEvent = {
    details: Transaction;
};

interface CalendarModalProps  {
    selectedEvent: SelectedEvent;
    handleCloseModal: () => void;
};

export default function CalendarModal({ selectedEvent, handleCloseModal }: CalendarModalProps) {
    const { t } = useTranslation("modals");

    return (
        <Modal
            isOpen={!!selectedEvent}
            onRequestClose={handleCloseModal}
            contentLabel="Transaction details"
            ariaHideApp={false}
            className="relative bg-slate-200 border-2 border-slate-400 w-9/12 md:w-fit py-6 px-14 rounded-md shadow-lg z-999 bg-opacity-100"
            overlayClassName="modal-overlay fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center"
        >
            {selectedEvent && (
                <>
                    <div className='z-999 flex flex-col gap-2'>
                        <h2 className="md:text-xl font-semibold text-center">{t("calendar.heading")}</h2>
                        <p><strong>{t("calendar.category")}</strong> {selectedEvent.details.categoryName}</p>
                        <p><strong>{t("calendar.type")}</strong> {selectedEvent.details.type}</p>
                        <p><strong>{t("calendar.value")}</strong> {selectedEvent.details.value}</p>
                        <p><strong>{t("calendar.user")}</strong> {selectedEvent.details.userName}</p>
                        <p><strong>{t("calendar.date")}</strong> {new Date(selectedEvent.details.addedAt).toLocaleString()}</p>
                    </div>

                    <div className='w-full flex justify-center'>
                        <button
                            onClick={handleCloseModal}
                            className="form-submit-modal-btn"
                        >
                            {t("cancel")}
                        </button>
                    </div>

                </>
            )}
        </Modal>
    )
}