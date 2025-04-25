import { useContext } from "react";
import { AuthContext } from "@store/authContext";
import { useModal } from "@hooks/useModal";
import { useTranslation } from "react-i18next";
import ModalComponent from "./ModalComponent";
import AddTransactionModal from "@components/modals/AddTransactionModal";
import { SendMessageModal } from "@components/modals/messagesModals/messagesModals";
import AddUserToHouseModal from "@components/modals/AddUserToHouseModal";
import ChangeEmailModal from "@components/modals/ChangeEmailModal";
import DeclareBudgetModal from "@components/modals/DeclareBudgetModal";
import CookiesModal from "@components/modals/CookiesModal";
import AddReviewModal from "@components/modals/AddReviewModal";
import { dashboardBtnsArray } from "@utils/arraysUtils/fastActionsArray";
import { filterArray, mapArray } from "@utils/arraysUtils/arraysFunctions";
import { showInfoToast } from "@configs/toastify";
import { getClickHandler, getModalComponents, modalData } from "@utils/fastActionsUtils";
import { BtnObj } from "@utils/arraysUtils/fastActionsArray";
import { FastActionsProps } from "@models/componentsTypes/FastActionsSectionTypes";
import { type ModalData } from "@models/componentsTypes/FastActionsSectionTypes";

export default function FastActions({ profilePage, action }: FastActionsProps) {
  const { modal, openModal, closeModal } = useModal<keyof ModalData>({
    isOpen: false,
    modalType: '',
    data: '',
  });
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

  const modalComponents = getModalComponents({
    AddTransactionModal,
    SendMessageModal,
    AddUserToHouseModal,
    ChangeEmailModal,
    DeclareBudgetModal,
    CookiesModal,
    AddReviewModal,
  });

  return (
    <>
      <div id='fastActions' className='fast-actions'>
        {mapArray(
          filterArray(dashboardBtnsArray, (btn: BtnObj) =>
            btn.profilePage === profilePage || btn.profilePage === undefined
          ),
          ({ label, actionType }) => (
            <button
              key={actionType}
              onClick={getClickHandler({
                actionType,
                handleButtonClick,
                openModal,
                showInfoToast,
                user,
                tInternal
              })}
              className='fast-actions-btn'
              style={{ boxShadow: 'inset 0 0 1px 2px rgba(0, 0, 0, 0.15)' }}
            >
              {tCommon(`fastActionsBtns.${label}`)}
            </button>
          )
        )}
      </div>
      {modal.isOpen && (
        <ModalComponent
          Component={modalComponents[modal.modalType]}
          isOpen={modal.isOpen}
          onRequestClose={closeModal}
          props={modalData[modal.modalType]}
        />
      )}
    </>
  );
}
