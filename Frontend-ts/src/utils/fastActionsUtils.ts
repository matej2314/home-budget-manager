import { isHostRole } from "./checkUserRole";
import { ComponentType} from "react";
import { type ModalData, ClickHandlerInput } from "@models/componentsTypes/FastActionsSectionTypes";

export const modalData: ModalData = {
  message: { data: '' },
  addTransaction: { data: '' },
  addUserToHouse: { data: '' },
  changeEmail: { data: '' },
  declareBudget: { data: '' },
  cookies: { data: '' },
  addReview: { data: '' },
};



export const getClickHandler = ({ actionType, handleButtonClick, openModal, showInfoToast, user, tInternal }: ClickHandlerInput) => {
    switch (actionType) {
        case 'mates':
        case 'avatar':
            return () => handleButtonClick(actionType);
        case 'declare':
            return () => {
                if (!isHostRole(user)) {
                    showInfoToast(tInternal("fastActions.noHostError"));
                    return;
                }
                openModal(actionType, '');
            };
        case 'transaction':
        case 'message':
        case 'addUser':
        case 'email':
        case 'cookies':
        case 'review':
            return () => openModal(actionType, '');
    }
};

interface ModalComponentMap {
    [key: string]: ComponentType<{ isOpen: boolean; onRequestClose: () => void, data: string }>;
}

export const getModalComponents = ({
    AddTransactionModal,
    SendMessageModal,
    AddUserToHouseModal,
    ChangeEmailModal,
    DeclareBudgetModal,
    CookiesModal,
    AddReviewModal
  }: ModalComponentMap): ModalComponentMap => ({
    transaction: AddTransactionModal,
    message: SendMessageModal,
    addUser: AddUserToHouseModal,
    email: ChangeEmailModal,
    declare: DeclareBudgetModal,
    cookies: CookiesModal,
    review: AddReviewModal,
  });