import { useEffect} from "react";
import { useTransactionsStore } from "@store/transactionsStore";
import { useTranslation } from "react-i18next";
import Modal from 'react-modal';
import TransactionsList from "@components/dashboard/dashboard-internal-components/TransactionsList";
import DashboardHeader from "@components/dashboard/dashboardComponents/DashboardHeader";
import AddTransactionModal from "@components/modals/AddTransactionModal";
import TransactionsCategoriesModal from "@components/modals/TransactionsCategoriesModal";
import { useModal } from "@hooks/useModal";
import useDocumentTitle from '@hooks/useDocumentTitle';
import ModalComponent from "@components/dashboard/dashboard-internal-components/ModalComponent";

Modal.setAppElement('#root');

interface TransactionsModalsProps {
    isOpen: boolean;
    onRequestClose: () => void;
};

export default function TransactionsPage() {
    const { fetchTransactions, actionsLoading, actionsDataError, actionsData, actionsTotalPages, isTransactionsFetched } = useTransactionsStore();
    const { modal, openModal, closeModal } = useModal({ isOpen: false, modalType: '', data: null });
    useDocumentTitle('Transactions');
    const { t } = useTranslation("pages");

    useEffect(() => {
        if (!isTransactionsFetched) {
            fetchTransactions(1);
        };
    }, [isTransactionsFetched]);

    const transactions = Array.isArray(actionsData) ? actionsData : [];

    const modalComponents = {
        transaction: AddTransactionModal,
        categories: TransactionsCategoriesModal,
    } as const;

    type ModalKey = keyof typeof modalComponents;

    const modalToRender = modalComponents[modal.modalType as ModalKey];

    return (
        <div id="pagecontent" className="min-h-screen w-screen bg-slate-200 overflow-y-hidden mb-3">
            <DashboardHeader />
            <div id="middle-content" className="flex flex-col gap-4  pt-3 pb-4 px-5">
                <div id='actionBtns' className="w-[75vw] h-fit flex  md:flex-row justify-center items-center rounded-md gap-3">
                    <button
                        onClick={() => openModal('transaction', null)}
                        className="transactions-page-select-modal-btn"
                        style={{ boxShadow: 'inset 0 0 2px 2px rgba(0, 0, 0, 0.15)' }}
                    >
                        {t("transactionsPage.addNewBtn")}
                    </button>
                    <button
                        className="transactions-page-select-modal-btn"
                        onClick={() => openModal('categories', null)}
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
                    getTransactions={fetchTransactions}
                />
            </div>
            {modal.isOpen &&
                <ModalComponent<TransactionsModalsProps>
                Component={modalToRender}
                isOpen={modal.isOpen}
                onRequestClose={closeModal}
                props={{
                    isOpen: modal.isOpen,
                    onRequestClose: closeModal,
                }}
            />}

        </div>
    );
}
