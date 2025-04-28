import { type Transaction } from "@models/transactionsStoreTypes";

export type SelectedEvent = {
    details: Transaction;
};

export interface CalendarModalProps  {
    selectedEvent: SelectedEvent;
    handleCloseModal: () => void;
};