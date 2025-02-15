import { useState, useContext, useEffect } from "react";
import { DataContext } from "../../store/dataContext";
import TransactionsList from "../../components/dashboard/dashboard-internal-components/TransactionsList";
import DashboardHeader from "../../components/dashboard/dashboardComponents/DashBoardHeader";
import AddTransactionModal from "../../components/modals/AddTransactionModal";
import TransactionsCategoriesModal from "../../components/modals/TransactionsCategoriesModal";
import Modal from 'react-modal';

Modal.setAppElement('#root');

export default function TransactionsPage() {
    const {
        fetchTransactions,
        actionsData,
        actionsError,
        actionsLoading,
        isTransactionsFetched,
        actionsTotalPages,
    } = useContext(DataContext);

    const transactions = Array.isArray(actionsData) ? actionsData : [];
    const [modal, setModal] = useState({ isOpen: false, type: null });

    useEffect(() => {
        fetchTransactions(1);
    }, []);

    const handleAddTransaction = () => {
        setModal({ isOpen: true, type: 'transaction' });
    };

    const handleShowCategories = () => {
        setModal({ isOpen: true, type: 'categories' });
    }

    const handleCloseModal = () => {
        setModal({ isOpen: false, type: null });
    };

    return (
        <div id="pagecontent" className="min-h-screen w-screen bg-slate-200 overflow-y-hidden">
            <DashboardHeader />
            <div id="middle-content" className="flex flex-col gap-4 border-2 border-b-slate-800/5 pt-3 pb-4 px-5">
                <div id='actionBtns' className="w-[75vw] h-fit flex justify-center items-center rounded-md gap-3">
                    <button
                        onClick={handleAddTransaction}
                        className="w-fit h-fit border-2 border-slate-400 rounded-2xl p-4 shadow-sm shadow-slate-500 active:shadow hover:bg-slate-300/60"
                    >
                        Add new transaction
                    </button>
                    <button
                        className="w-fit h-fit border-2 border-slate-400 rounded-2xl p-4 shadow-sm shadow-slate-500 active:shadow hover:bg-slate-300/60"
                        onClick={handleShowCategories}
                    >
                        Vew all categories
                    </button>
                </div>
                <TransactionsList
                    mainSite={false}
                    transactions={actionsData && transactions}
                    actionsLoading={actionsLoading}
                    actionsError={actionsError}
                    actionsTotalPages={actionsTotalPages}
                    getTransactions={fetchTransactions}
                />
            </div>
            {modal.isOpen && modal.type === 'transaction' && <AddTransactionModal handleOpen={modal.isOpen} onRequestClose={handleCloseModal} />}
            {modal.isOpen && modal.type === 'categories' && <TransactionsCategoriesModal isOpen={modal.isOpen} onRequestClose={handleCloseModal} />}
        </div>
    );
}
