import Modal from 'react-modal';
import DeclareBudgetForm from '../forms/DeclareBudgetForm';


export default function DeclareBudgetModal({ isOpen, onRequestClose }) {

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
                    className="bg-gray-300 text-black p-2 rounded-md border-[1px] border-slate-500 hover:bg-gray-400 hover:text-slate-200"
                >
                    Cancel
                </button>
            </div>
        </Modal>
    )
}
