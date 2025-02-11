import Modal from 'react-modal';
import AddTransactionForm from '../forms/AddTransactionForm';


export default function AddTransactionModal({ handleOpen, onRequestClose }) {

    return (
        <Modal
            isOpen={handleOpen}
            onRequestClose={onRequestClose}
            contentLabel="Add New Transaction"
            className="w-[400px] p-6 bg-slate-200 rounded-lg shadow-lg translate-x-[40vw] translate-y-[10vh]"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        >
            <h2 className="w-full h-fit flex justify-center text-2xl mb-7">Add New Transaction</h2>
            <AddTransactionForm onClose={onRequestClose} />
            <div className="flex justify-end mt-4">
                <button
                    onClick={onRequestClose}
                    className="bg-gray-300 text-black p-2 rounded-md border-[1px] border-slate-500 hover:bg-gray-400 hover:text-slate-200"
                >
                    Cancel
                </button>
            </div>
        </Modal>
    )

}