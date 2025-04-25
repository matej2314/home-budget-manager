import { type User } from "@models/authTypes";
import { type TFunction } from "i18next";

export type ModalData = { [key: string]: any };

export type FastActionsProps = {
    profilePage: boolean;
  action?: (type: string) => void;
  openModal?: () => void;
};
  
export interface ClickHandlerInput {
  actionType: string;
  handleButtonClick: (actionType: string) => void;
  openModal: (modalType: string, data: string) => void;
  showInfoToast: (message: string) => void;
  user: User;
  tInternal: TFunction;
}