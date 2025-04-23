import { ComponentType, useContext } from "react"
import { AuthContext } from "@store/authContext";
import {useModal} from "@hooks/useModal";
import { useTranslation } from "react-i18next";
import ModalComponent from "./ModalComponent";
// import AddTransactionModal from '@modals/AddTransactionModal';
// import { SendMessageModal } from "@modals/messagesModals/messagesModals";
// import AddUserToHouseModal from '@modals/AddUserToHouseModal';
// import ChangeEmailModal from "@modals/ChangeEmailModal";
// import DeclareBudgetModal from "@modals/DeclareBudgetModal";
// import CookiesModal from '@modals/CookiesModal';
// import AddReviewModal from "@modals/AddReviewModal";
import { dashboardBtnsArray } from "@utils/arraysUtils/fastActionsArray";
import { filterArray, mapArray } from "@utils/arraysUtils/arraysFunctions";
import { showInfoToast } from "@configs/toastify";
import { getClickHandler, getModalComponents } from "@utils/fastActionsUtils";
import { BtnObj } from "@utils/arraysUtils/fastActionsArray";

type FastActionsInput = {
    profilePage: boolean;
    action: (type: string) => void;
};

export default function FastActions({ profilePage, action }: FastActionsInput) {
    const { modal, openModal, closeModal } = useModal<undefined>({ isOpen: false, modalType: '', data: null });
    const { t: tInternal } = useTranslation("dashboardInternal");
    const { t: tCommon } = useTranslation("common");
    const { user } = useContext(AuthContext)!;

    const handleButtonClick = (type: string) => {
        if (typeof action === 'function') {
            action(type);
        } else {
            console.error("action must be a function!");
        }
    };

    const modalComponents: Record<string, ComponentType<any>> = getModalComponents({
        AddTransactionModal,
        SendMessageModal,
        AddUserToHouseModal,
        ChangeEmailModal,
        DeclareBudgetModal,
        CookiesModal,
        AddReviewModal
    });

    return (
        <>
            <div id='fastActions' className='fast-actions'>
                {mapArray(filterArray(dashboardBtnsArray, (btn: BtnObj) => btn.profilePage === profilePage || btn.profilePage === undefined),
                    ({ label, actionType }) => (
                        <button
                            key={actionType}
                            onClick={getClickHandler(actionType, handleButtonClick, openModal, showInfoToast, user, tInternal)}
                            className='fast-actions-btn'
                            style={{ boxShadow: 'inset 0 0 1px 2px rgba(0, 0, 0, 0.15)' }}
                        >
                            {tCommon(`fastActionsBtns.${label}`)}
                        </button>
                    ))
                }
            </div>
            {modal.isOpen && <ModalComponent
                Component={modalComponents[modal.modalType]}
                isOpen={modal.isOpen}
                onRequestClose={closeModal}
            />}
        </>
    )
}