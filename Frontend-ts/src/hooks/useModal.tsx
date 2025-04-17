import { useState, useCallback} from "react";


interface ModalState<T = unknown> {
    isOpen: boolean;
    modalType: string;
    data: T | null;
}

const initialModalState: ModalState = {
    isOpen: false,
    modalType: '',
    data: null,
};

export const useModal = <T = unknown>(defaultState?: ModalState<T>) => {
    const [modal, setModal] = useState<ModalState<T>>(defaultState ?? initialModalState as ModalState<T>);

    const openModal = useCallback((modalType: string, data: T) => {
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
