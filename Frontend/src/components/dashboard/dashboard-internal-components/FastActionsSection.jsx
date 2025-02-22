import { useContext } from "react"
import { AuthContext } from "../../../store/authContext";
import AddTransactionModal from '../../modals/AddTransactionModal';
import SendMessageModal from "../../modals/SendMessageModal";
import AddUserToHouseModal from '../../modals/AddUserToHouseModal';
import ChangeEmailModal from "../../modals/ChangeEmailModal";
import DeclareBudgetModal from "../../modals/DeclareBudgetModal";
import CookiesModal from '../../modals/CookiesModal';
import AddReviewModal from "../../modals/AddReviewModal";
import useModal from "../../../hooks/useModal";

export default function FastActions({ profilePage, action }) {
    const { modal, openModal, closeModal } = useModal({ isOpen: false, type: null });
    const { user } = useContext(AuthContext);

    const handleButtonClick = (type) => {
        if (typeof action === 'function') {
            action(type);
        } else {
            console.error("action must be a function!");
        }
    };

    return (
        <>
            <div id='fastActions' className='w-full flex justify-start items-center gap-3 ml-10 py-2'>
                {!profilePage && <button
                    onClick={() => openModal('declare')}
                    className={`w-fit h-fit bg-slate-300/40 p-2 rounded-xl border-[1px] border-slate-400 shadow-sm shadow-slate-500 active:shadow hover:bg-slate-300/60 ${user.role !== 'host' && 'hidden'}`}
                >
                    Declare new budget
                </button>
                }
                <button
                    onClick={() => openModal('transaction')}
                    className='w-fit h-fit bg-slate-300/40 p-2 rounded-xl border-[1px] border-slate-400 shadow-sm shadow-slate-500 active:shadow hover:bg-slate-300/60'
                >
                    Add transaction
                </button>
                <button
                    onClick={() => openModal('message')}
                    className='w-fit h-fit bg-slate-300/40 p-2 rounded-xl border-[1px] border-slate-400 shadow-sm shadow-slate-500 active:shadow hover:bg-slate-300/60'
                >
                    Send message
                </button>
                <button
                    onClick={() => openModal('addUser')}
                    className='w-fit h-fit bg-slate-300/40 p-2 rounded-xl border-[1px] border-slate-400 shadow-sm shadow-slate-500 active:shadow hover:bg-slate-300/60'
                >
                    Add housemate
                </button>
                {profilePage && <>
                    <button
                        onClick={() => handleButtonClick('mates')}
                        className='w-fit h-fit bg-slate-300/40 p-2 rounded-xl border-[1px] border-slate-400 shadow-sm shadow-slate-500 active:shadow hover:bg-slate-300/60'
                        type="button"
                    >
                        Your housemates
                    </button>
                    <button
                        onClick={() => handleButtonClick('avatar')}
                        className='w-fit h-fit bg-slate-300/40 p-2 rounded-xl border-[1px] border-slate-400 shadow-sm shadow-slate-500 active:shadow hover:bg-slate-300/60'
                        type="button"
                    >
                        Change avatar
                    </button>
                    <button
                        onClick={() => openModal('email')}
                        className='w-fit h-fit bg-slate-300/40 p-2 rounded-xl border-[1px] border-slate-400 shadow-sm shadow-slate-500 active:shadow hover:bg-slate-300/60'
                        type="button"
                    >
                        Change e-mail address
                    </button>
                    <button
                        onClick={() => openModal('cookies')}
                        className='w-fit h-fit bg-slate-300/40 p-2 rounded-xl border-[1px] border-slate-400 shadow-sm shadow-slate-500 active:shadow hover:bg-slate-300/60'
                        type="button"
                    >
                        Cookies settings
                    </button>
                    <button
                        className='w-fit h-fit bg-slate-300/40 p-2 rounded-xl border-[1px] border-slate-400 shadow-sm shadow-slate-500 active:shadow hover:bg-slate-300/60'
                        type="button"
                        onClick={() => openModal('review')}
                    >
                        Add app review
                    </button>
                </>}
            </div>
            {modal.isOpen && modal.type === 'message' && (
                <SendMessageModal isOpen={modal.isOpen} onRequestClose={closeModal} />
            )}
            {modal.isOpen && modal.type === 'transaction' && (
                <AddTransactionModal handleOpen={modal.isOpen} onRequestClose={closeModal} />
            )}
            {modal.isOpen && modal.type === 'addUser' && (
                <AddUserToHouseModal handleOpen={modal.isOpen} onRequestClose={closeModal} />
            )}
            {modal.isOpen && modal.type === 'email' && (<ChangeEmailModal handleOpen={modal.isOpen} onRequestClose={closeModal} />)}
            {modal.isOpen && modal.type === 'declare' && user.role === 'host' && <DeclareBudgetModal isOpen={modal.isOpen} onRequestClose={closeModal} />}
            {modal.isOpen && modal.type === 'cookies' && <CookiesModal handleOpen={modal.isOpen} onRequestClose={closeModal} />}
            {modal.isOpen && modal.type === 'review' && <AddReviewModal isOpen={modal.isOpen} onRequestClose={closeModal} />}
        </>
    )
}