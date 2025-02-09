import { useState, useContext } from "react"
import { AuthContext } from "../../../store/authContext";
import AddTransactionModal from '../../modals/AddTransactionModal';
import SendMessageModal from "../../modals/SendMessageModal";
import AddUserToHouseModal from '../../modals/AddUserToHouseModal';
import ChangeEmailModal from "../../modals/ChangeEmailModal";
import DeclareBudgetModal from "../../modals/DeclareBudgetModal";

export default function FastActions({ profilePage, action }) {

    const [modal, setModal] = useState({ isOpen: false, type: null });
    const { user } = useContext(AuthContext);

    const handleOpenModal = (type) => {
        setModal({ isOpen: true, type: type });
    };

    const handleCloseModal = () => {
        setModal({ isOpen: false, type: null });
    };

    return (
        <>
            <div id='fastActions' className='w-full flex justify-start items-center gap-3 ml-10 py-2'>
                {profilePage ? <button
                    onClick={() => window.location.reload()}
                    className='w-fit h-fit bg-slate-300/40 p-2 rounded-xl border-[1px] border-slate-400 shadow-sm shadow-slate-500 active:shadow hover:bg-slate-300/60'
                >
                    Home
                </button> :
                    <button
                        onClick={() => handleOpenModal('declare')}
                        className={`w-fit h-fit bg-slate-300/40 p-2 rounded-xl border-[1px] border-slate-400 shadow-sm shadow-slate-500 active:shadow hover:bg-slate-300/60 ${user.role !== 'host' && 'hidden'}`}
                    >
                        Declare new budget
                    </button>
                }
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
                {profilePage && <>
                    <button
                        onClick={() => action('mates')}
                        className='w-fit h-fit bg-slate-300/40 p-2 rounded-xl border-[1px] border-slate-400 shadow-sm shadow-slate-500 active:shadow hover:bg-slate-300/60'
                        type="button"
                    >
                        Your housemates
                    </button>
                    <button
                        onClick={() => action('avatar')}
                        className='w-fit h-fit bg-slate-300/40 p-2 rounded-xl border-[1px] border-slate-400 shadow-sm shadow-slate-500 active:shadow hover:bg-slate-300/60'
                        type="button"
                    >
                        Change avatar
                    </button>
                    <button
                        onClick={() => handleOpenModal('email')}
                        className='w-fit h-fit bg-slate-300/40 p-2 rounded-xl border-[1px] border-slate-400 shadow-sm shadow-slate-500 active:shadow hover:bg-slate-300/60'
                        type="button"
                    >
                        Change e-mail address
                    </button>

                </>}
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
            {modal.isOpen && modal.type === 'email' && (<ChangeEmailModal handleOpen={modal.isOpen} onRequestClose={handleCloseModal} />)}
            {modal.isOpen && modal.type === 'declare' && user.role === 'host' && <DeclareBudgetModal isOpen={modal.isOpen} onRequestClose={handleCloseModal} />}
        </>
    )
}