import Modal from 'react-modal';
import AddTransactionForm from '@components/forms/AddTransactionForm';
import { useTranslation } from 'react-i18next';
import { type BasicModalProps } from '@models/componentsTypes/modalsTypes';

Modal.setAppElement('#root');

export default function AddTransactionModal({ isOpen, onRequestClose }: BasicModalProps) {
    const { t } = useTranslation("modals");

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Add New Transaction"
            className='bg-slate-200 rounded-lg p-6 mx-auto mt-10 shadow-lg border-4 border-slate-400'
            overlayClassName='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'
        >
            <h2 className="w-full h-fit flex justify-center text-2xl mb-7">{t("addTransaction.heading")}</h2>
            <AddTransactionForm onClose={onRequestClose} />
            <div className="flex justify-end mt-4">
                <button
                    onClick={onRequestClose}
                    className='form-submit-modal-btn'
                >
                    {t("cancel")}
                </button>
            </div>
        </Modal>
    )

}