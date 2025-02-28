import { useEffect } from "react";
import { useTransactionsStore } from "../../store/transactionsStore";
import Modal from 'react-modal';
import TransactionsList from "../../components/dashboard/dashboard-internal-components/TransactionsList";
import DashboardHeader from "../../components/dashboard/dashboardComponents/DashBoardHeader";
import AddTransactionModal from "../../components/modals/AddTransactionModal";
import TransactionsCategoriesModal from "../../components/modals/TransactionsCategoriesModal";
import useModal from "../../hooks/useModal";
import useDocumentTitle from '../../hooks/useDocumentTitle';
import ModalComponent from "../../components/dashboard/dashboard-internal-components/ModalComponent";

Modal.setAppElement('#root');

export default function TransactionsPage() {
    const { fetchTransactions, actionsLoading, actionsDataError, actionsData, actionsTotalPages, isTransactionsFetched } = useTransactionsStore();
    const { modal, openModal, closeModal } = useModal({ isOpen: false, type: null });
    useDocumentTitle('Transactions');

    useEffect(() => {
        if (!isTransactionsFetched) {
            fetchTransactions();
        };
    }, [isTransactionsFetched]);

    const transactions = Array.isArray(actionsData) ? actionsData : [];

    const handleOpenModal = (type) => {
        openModal(type);
    }

    const modalComponents = {
        transaction: AddTransactionModal,
        categories: TransactionsCategoriesModal,
    };

    return (
        <div id="pagecontent" className="min-h-screen w-screen bg-slate-200 overflow-y-hidden">
            <DashboardHeader />
            <div id="middle-content" className="flex flex-col gap-4 border-2 border-b-slate-800/5 pt-3 pb-4 px-5">
                <div id='actionBtns' className="w-[75vw] h-fit flex  md:flex-row justify-center items-center rounded-md gap-3">
                    <button
                        onClick={() => openModal('transaction')}
                        className="w-fit h-fit border-2 border-slate-400 text-sm lg:text-base rounded-2xl p-4 shadow-sm shadow-slate-500 active:shadow hover:bg-slate-300/60"
                    >
                        Add new transaction
                    </button>
                    <button
                        className="w-fit h-fit border-2 border-slate-400 rounded-2xl p-4 shadow-sm shadow-slate-500 active:shadow hover:bg-slate-300/60"
                        onClick={() => openModal('categories')}
                    >
                        Vew all categories
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
            {modal.isOpen && <ModalComponent
                Component={modalComponents[modal.type]}
                isOpen={modal.isOpen}
                onRequestClose={closeModal}
            />}

        </div>
    );
}
