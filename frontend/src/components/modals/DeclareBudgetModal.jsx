import Modal from 'react-modal';
import DeclareBudgetForm from '../forms/DeclareBudgetForm';
import { useTranslation } from 'react-i18next';


export default function DeclareBudgetModal({ isOpen, onRequestClose }) {
    const { t } = useTranslation("modals");

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            className='bg-slate-200 rounded-lg p-6 md:w-1/2 md:mb-40 lg:mt-100 xl:mb-60 xl:w-1/3 mx-auto mt-10 shadow-lg border-4 border-slate-400'
            overlayClassName='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'
        >
            <DeclareBudgetForm onRequestClose={onRequestClose} />
            <div className="flex justify-end mt-4">
                <button
                    onClick={onRequestClose}
                    className="form-submit-modal-btn"
                >
                    {t("cancel")}
                </button>
            </div>
        </Modal>
    )
}
