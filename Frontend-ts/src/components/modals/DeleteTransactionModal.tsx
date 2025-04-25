import { useContext, useState } from 'react';
import { AuthContext } from '@store/authContext';
import { type Transaction } from '@models/transactionsStoreTypes';
import { type AuthContextType } from '@models/authTypes';
import Modal from 'react-modal';
import sendRequest from '@utils/asyncUtils/sendRequest';
import { serverUrl } from 'url';
import { useTransactionsStore } from '@store/transactionsStore';
import { showErrorToast, showInfoToast } from '@configs/toastify';
import LoadingModal from './LoadingModal';
import { useTranslation } from 'react-i18next';

interface DeleteTransactionModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    transaction: Transaction;
};

export default function DeleteTransactionModal({ isOpen, onRequestClose, transaction }: DeleteTransactionModalProps) {
    const { fetchTransactions } = useTransactionsStore();
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useContext(AuthContext) as AuthContextType;
    const { t } = useTranslation("modals");

    const handleDeleteAction = async (transaction: Transaction) => {

        if (transaction.userName !== user.userName) {
            showErrorToast('Nie dodałeś tej transakcji!');
            onRequestClose();
        };

        try {
            setIsLoading(true);
            const actionData = { transactionId: transaction.transactionId };
            const deleteAction = await sendRequest('DELETE', actionData, `${serverUrl}/action`);

            if (deleteAction.status === 'success') {
                    showInfoToast(t("deleteTransaction.successMessage"));
                    fetchTransactions(1);
                    onRequestClose();
                }else {
                    showErrorToast(t("deleteTransaction.failedMessage"));
            };
        } catch (error) {
            showErrorToast(t("deleteTransaction.errorMessage"));
            console.error('Delete transaction error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            className="w-11/12 xl:w-[400px] p-6 bg-slate-200 rounded-lg shadow-lg translate-y-1/2 mx-auto"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        >
            <div className='w-full h-fit flex flex-col justify-center items-center gap-5'>
                <h2 className='w-full h-fit fle justify-center font-semibold'>{t("deleteTransaction.heading")}</h2>
                <div id='btnsDiv' className='w-full h-fit flex justify-around'>
                    <button
                        type="button"
                        className="form-submit-modal-btn"
                        onClick={() => handleDeleteAction(transaction)}
                    >
                        {t("btnYes")}
                    </button>
                    <button
                        onClick={onRequestClose}
                        type="button"
                        className="form-submit-modal-btn"
                    >
                        {t("btnNo")}
                    </button>
                </div>
                {isLoading && <LoadingModal isOpen={isLoading} />}
            </div>
        </Modal>
    )
}