import { isHostRole } from "./checkUserRole";
import { type User } from "@models/authTypes";
import { ComponentType} from "react";
import { type TFunction } from "i18next";

interface ClickHandlerInput {
    actionType: string;
    handleButtonClick: (actionType: string) => void;
    openModal: (actionType: string) => void;
    showInfoToast: (message: string) => void;
    user: User;
    tInternal: TFunction;
}

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

export const getModalComponents = ({
    AddTransactionModal,
    SendMessageModal,
    AddUserToHouseModal,
    ChangeEmailModal,
    DeclareBudgetModal,
    CookiesModal,
    AddReviewModal
}: ComponentType[]):Record<string, ComponentType> => ({
    transaction: AddTransactionModal,
    message: SendMessageModal,
    addUser: AddUserToHouseModal,
    email: ChangeEmailModal,
    declare: DeclareBudgetModal,
    cookies: CookiesModal,
    review: AddReviewModal,
});