import { useState } from "react"
import AddTransactionModal from '../../modals/AddTransactionModal';
import SendMessageModal from "../../modals/SendMessageModal";
import AddUserToHouseModal from '../../modals/AddUserToHouseModal';


export default function FastActions() {

    const [modal, setModal] = useState({ isOpen: false, type: null });

    const handleOpenModal = (type) => {
        setModal({ isOpen: true, type: type });
    };

    const handleCloseModal = () => {
        setModal({ isOpen: false, type: null });
    }

    return (
        <>
            <div id='fastActions' className='w-full flex justify-start items-center gap-3 ml-10 py-2'>
                <div><h2>Fast actions:</h2></div>
                <button
                    onClick={() => handleOpenModal('transaction')}
                    className='w-fit h-fit bg-slate-300/40 p-2 rounded-xl border-[1px] border-slate-400 shadow-sm shadow-slate-500 active:shadow hover:bg-slate-300/60'
                >
                    Add transaction
                </button>
                <button
                    onClick={() => handleOpenModal('message')}
                    className='w-fit h-fit bg-slate-300/40 p-2 rounded-xl border-[1px] border-slate-400 shadow-sm shadow-slate-500 active:shadow hover:bg-slate-300/60'
                >
                    Send message
                </button>
                <button
                    onClick={() => handleOpenModal('addUser')}
                    className='w-fit h-fit bg-slate-300/40 p-2 rounded-xl border-[1px] border-slate-400 shadow-sm shadow-slate-500 active:shadow hover:bg-slate-300/60'
                >
                    Add housemate
                </button>
            </div>
            {modal.isOpen && modal.type === 'message' && (
                <SendMessageModal isOpen={modal.isOpen} onRequestClose={handleCloseModal} />
            )}
            {modal.isOpen && modal.type === 'transaction' && (
                <AddTransactionModal handleOpen={modal.isOpen} onRequestClose={handleCloseModal} />
            )}
            {modal.isOpen && modal.type === 'addUser' && (
                <AddUserToHouseModal handleOpen={modal.isOpen} onRequestClose={handleCloseModal} />
            )}
        </>
    )
}