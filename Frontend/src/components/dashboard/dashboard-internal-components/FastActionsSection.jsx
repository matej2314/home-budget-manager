import { useContext } from "react"
import { AuthContext } from "../../../store/authContext";
import useModal from "../../../hooks/useModal";
import { useTranslation } from "react-i18next";
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
    const { t: tInternal } = useTranslation("dashboardInternal");
    const { t: tCommon } = useTranslation("common");
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
                        showInfoToast(tInternal("fastActions.noHostError"));
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
            <div id='fastActions' className='fast-actions'>
                {mapArray(filterArray(dashboardBtnsArray, (btn) => btn.profilePage === profilePage || btn.profilePage === undefined),
                    ({ label, actionType }) => (
                        <button
                            key={actionType}
                            onClick={getClickHandler(actionType)}
                            className='fast-actions-btn'
                            style={{ boxShadow: 'inset 0 0 1px 2px rgba(0, 0, 0, 0.15)' }}
                        >
                            {tCommon(`fastActionsBtns.${label}`)}
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