import { isHostRole } from "./checkUserRole";


export const getClickHandler = (actionType, handleButtonClick, openModal, showInfoToast, user, tInternal) => {
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
}) => ({
    transaction: AddTransactionModal,
    message: SendMessageModal,
    addUser: AddUserToHouseModal,
    email: ChangeEmailModal,
    declare: DeclareBudgetModal,
    cookies: CookiesModal,
    review: AddReviewModal,
});