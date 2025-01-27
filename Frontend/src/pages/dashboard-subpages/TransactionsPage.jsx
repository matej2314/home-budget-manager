import { useState } from "react";
import { useNavigate } from "react-router-dom";

import TransactionsList from "../../components/internal-components/TransactionsList";
import DashboardHeader from "../../components/dashboard/dashboardComponents/DashBoardHeader";
import AddTransactionForm from "../../components/forms/AddTransactionForm";
import Modal from 'react-modal';

Modal.setAppElement('#root');

export default function TransactionsPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    const handleClickAdd = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div id="pagecontent" className="bg-slate-200 w-screen h-screen flex flex-col">
            <DashboardHeader />
            <div id="middle-content" className="flex flex-col gap-4 border-2 border-b-slate-800/5 pt-3 pb-4 px-5">
                <div id='actionBtns' className="w-[75vw] h-fit flex justify-center items-center rounded-md gap-3">
                    <button onClick={handleClickAdd} className="w-fit h-fit border-2 border-slate-400 rounded-2xl p-4">Add new transaction</button>
                    <button className="w-fit h-fit border-2 border-slate-400 rounded-2xl p-4" onClick={() => navigate('/dashboard/actioncats')}>Vew all categories</button>
                </div>
                <TransactionsList />
            </div>

            <Modal
                isOpen={isModalOpen}
                onRequestClose={handleCloseModal}
                contentLabel="Add New Transaction"
                className="w-[400px] p-6 bg-slate-200 rounded-lg shadow-lg translate-x-[40vw] translate-y-[30vh]"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50"
            >
                <h2 className="w-full h-fit flex justify-center text-2xl mb-7">Add New Transaction</h2>
                <AddTransactionForm onClose={handleCloseModal} />
                <div className="flex justify-end mt-4">
                    <button
                        onClick={handleCloseModal}
                        className="bg-gray-300 text-black p-2 rounded-md"
                    >
                        Cancel
                    </button>
                </div>
            </Modal>
        </div>
    );
}
