import Modal from 'react-modal';
import AddTransactionForm from '../forms/AddTransactionForm';

export default function AddTransactionModal({ isOpen, onRequestClose }) {

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Add New Transaction"
            className='bg-slate-200 rounded-lg p-6 mx-auto mt-10 shadow-lg border-4 border-slate-400'
            overlayClassName='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'
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