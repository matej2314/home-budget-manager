import { useEffect } from "react";
import { useTransactionsStore } from "../../store/transactionsStore";
import { useTranslation } from "react-i18next";
import TransactionsList from "../../components/dashboard/dashboard-internal-components/TransactionsList";
import DashboardHeader from "../../components/dashboard/dashboardComponents/DashBoardHeader";
import AddTransactionModal from "../../components/modals/AddTransactionModal";
import TransactionsCategoriesModal from "../../components/modals/TransactionsCategoriesModal";
import useModal from "../../hooks/useModal";
import useDocumentTitle from '../../hooks/useDocumentTitle';
import ModalComponent from "../../components/dashboard/dashboard-internal-components/ModalComponent";

export default function TransactionsPage() {
    const { fetchTransactions, actionsLoading, actionsDataError, actionsData, actionsTotalPages, currentPage, isTransactionsFetched } = useTransactionsStore();
    const { modal, openModal, closeModal } = useModal({ isOpen: false, type: null });
    useDocumentTitle('Transactions');
    const { t } = useTranslation("pages");

    useEffect(() => {
        if (!isTransactionsFetched) {
            fetchTransactions();
        };
    }, [isTransactionsFetched, fetchTransactions]);

    const transactions = Array.isArray(actionsData) ? actionsData : [];

    const modalComponents = {
        transaction: AddTransactionModal,
        categories: TransactionsCategoriesModal,
    };

    return (
        <div id="pagecontent" className="w-full min-h-full min-w-0 bg-page overflow-y-auto no-scrollbar pb-8">
            <DashboardHeader />
            <div id="middle-content" className="flex flex-col gap-4 pt-3 sm:pt-4 pb-4 px-3 sm:px-5 lg:px-8">
                <div id='actionBtns' className="w-full max-w-xl mx-auto h-fit flex flex-col sm:flex-row justify-center items-stretch sm:items-center rounded-md gap-3">
                    <button
                        onClick={() => openModal('transaction')}
                        className="transactions-page-select-modal-btn"
                        style={{ boxShadow: 'inset 0 0 2px 2px rgba(0, 0, 0, 0.15)' }}
                    >
                        {t("transactionsPage.addNewBtn")}
                    </button>
                    <button
                        className="transactions-page-select-modal-btn"
                        onClick={() => openModal('categories')}
                        style={{ boxShadow: 'inset 0 0 2px 2px rgba(0, 0, 0, 0.15)' }}
                    >
                        {t("transactionsPage.categoriesBtn")}
                    </button>
                </div>
                <TransactionsList
                    mainSite={false}
                    transactions={actionsData && transactions}
                    actionsLoading={actionsLoading}
                    actionsError={actionsDataError}
                    actionsTotalPages={actionsTotalPages}
                    currentPage={currentPage}
                    getTransactions={fetchTransactions}
                />
            </div>
            {modal.isOpen && <ModalComponent
                Component={modalComponents[modal.type]}
                isOpen={modal.isOpen}
                onRequestClose={closeModal}
            />}

        </div>
    );
}
