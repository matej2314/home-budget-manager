import { useContext } from "react"
import { AuthContext } from "../../../store/authContext";
import useModal from "../../../hooks/useModal";
import ModalComponent from "./ModalComponent";
import AddTransactionModal from '../../modals/AddTransactionModal';
import { SendMessageModal } from "../../modals/messagesModals/messagesModals";
import AddUserToHouseModal from '../../modals/AddUserToHouseModal';
import ChangeEmailModal from "../../modals/ChangeEmailModal";
import DeclareBudgetModal from "../../modals/DeclareBudgetModal";
import CookiesModal from '../../modals/CookiesModal';
import AddReviewModal from "../../modals/AddReviewModal";
import { dashboardBtnsArray } from "../../../utils/arraysUtils/fastActionsArray";
import { filterArray, mapArray } from "../../../utils/arraysUtils/arraysFunctions";
import { showInfoToast } from "../../../configs/toastify";

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

    const getClickHandler = (actionType) => {
        switch (actionType) {
            case 'mates':
            case 'avatar':
                return () => handleButtonClick(actionType);
            case 'declare':
                return () => {
                    if (user.role !== 'host') {
                        showInfoToast('Nie jesteś gospodarzem!');
                        return;
                    }
                    openModal(actionType);
                };
            case 'transaction':
            case 'message':
            case 'addUser':
            case 'email':
            case 'cookies':
            case 'review':
                return () => openModal(actionType);
        }
    };

    const modalComponents = {
        transaction: AddTransactionModal,
        message: SendMessageModal,
        addUser: AddUserToHouseModal,
        email: ChangeEmailModal,
        declare: DeclareBudgetModal,
        cookies: CookiesModal,
        review: AddReviewModal,
    };

    return (
        <>
            <div id='fastActions' className='grid grid-cols-3 gap-y-2 px-5 md:flex md:flex-row justify-start items-center md:gap-3 md:ml-10 py-2'>
                {mapArray(filterArray(dashboardBtnsArray, (btn) => btn.profilePage === profilePage || btn.profilePage === undefined),
                    ({ label, actionType }) => (
                        <button
                            key={actionType}
                            onClick={getClickHandler(actionType)}
                            className={`w-fit h-fit bg-slate-300/40 p-2 text-sm md:text-base rounded-xl border-[1px] border-slate-400 shadow-sm shadow-slate-500 active:shadow hover:bg-slate-300/60`}
                        >
                            {label}
                        </button>
                    ))
                }
            </div>
            {modal.isOpen && <ModalComponent
                Component={modalComponents[modal.type]}
                isOpen={modal.isOpen}
                onRequestClose={closeModal}
            />}
        </>
    )
}