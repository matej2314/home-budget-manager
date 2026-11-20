import { useContext, useState } from 'react';
import { useAuth } from '../../store/authContext';
import { DataContext } from '../../store/dataContext';
import AppModal from './AppModal';
import ModalHeader from './ModalHeader';
import sendRequest from '../../utils/asyncUtils/sendRequest';
import { apiBaseUrl } from '../../url';
import { useTransactionsStore } from '../../store/transactionsStore';
import useApiResponseHandler from '../../hooks/useApiResponseHandler';
import { showErrorToast, showInfoToast } from '../../configs/toastify';
import LoadingModal from '../modals/LoadingModal';
import { useTranslation } from 'react-i18next';

export default function DeleteTransactionModal({ isOpen, onRequestClose, transaction }) {
    const { fetchTransactions } = useTransactionsStore();
    const { refreshData } = useContext(DataContext);
    const handleApiResponse = useApiResponseHandler();
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuth();
    const { t } = useTranslation("modals");

    const handleDeleteAction = async (transaction) => {

        if (transaction.userName !== user.userName) {
            showErrorToast('Nie dodałeś tej transakcji!');
            onRequestClose();
        };

        try {
            setIsLoading(true);
            const actionData = { transactionId: transaction.transactionId };
            const deleteAction = await sendRequest('DELETE', actionData, `${apiBaseUrl}/action`);

            handleApiResponse(deleteAction, {
                onSuccess: async () => {
                    showInfoToast(t("deleteTransaction.successMessage"));
                    await fetchTransactions();
                    await refreshData();
                    onRequestClose();
                },
                onError: () => {
                    showErrorToast(t("deleteTransaction.failedMessage"));
                }
            })
        } catch (error) {
            showErrorToast(t("deleteTransaction.errorMessage"));
            console.error('Delete transaction error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AppModal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel={t("deleteTransaction.heading")}
            className="modal-panel"
        >
            <ModalHeader title={t("deleteTransaction.heading")} onClose={onRequestClose} />
            <div className="modal-actions-center">
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
                    className="modal-btn-secondary"
                >
                    {t("btnNo")}
                </button>
            </div>
            {isLoading && <LoadingModal isOpen={isLoading} />}
        </AppModal>
    )
}
