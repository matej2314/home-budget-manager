import { useState, useCallback } from "react";

interface modalState {
    isOpen: boolean;
    modalType: string;
    data: unknown;
};

const initialModalState: modalState = {
    isOpen: false,
    modalType: '',
    data: null,
}


export const useModal = (defaultState: modalState = initialModalState) => {
    const [modal, setModal] = useState<modalState>(defaultState);

    const openModal = useCallback((modalType: string, data: unknown) => {
        setModal({
            isOpen: true,
            modalType,
            data,
        });
    }, []);

    const closeModal = useCallback(() => {
        setModal({
            isOpen: false,
            modalType: '',
            data: null,
        });
    }, []);

    return {
        modal,
        openModal,
        closeModal,
    };
};
