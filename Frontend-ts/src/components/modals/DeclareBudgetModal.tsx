import Modal from 'react-modal';
import DeclareBudgetForm from '@components/forms/DeclareBudgetForm';
import { useTranslation } from 'react-i18next';
import { type BasicModalProps } from '@models/componentsTypes/modalsTypes';

export default function DeclareBudgetModal({ isOpen, onRequestClose }: BasicModalProps) {
    const { t } = useTranslation("modals");

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            className='bg-slate-200 rounded-lg p-6 md:w-1/2 md:mb-[10rem] lg:mt-[25rem] xl:mb-[17rem] xl:w-1/3 mx-auto mt-10 shadow-lg border-4 border-slate-400'
            overlayClassName='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'
        >
            <DeclareBudgetForm />
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
