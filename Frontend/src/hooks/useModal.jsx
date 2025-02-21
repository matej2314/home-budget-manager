import { useState, useCallback } from 'react';

const useModal = (defaultState = { isOpen: false, type: null, data: null }) => {
    const [modal, setModal] = useState(defaultState);

    const openModal = useCallback((type, data = null) => {
        setModal({
            isOpen: true,
            type,
            data,
        });
    }, []);

    const closeModal = useCallback(() => {
        setModal({
            isOpen: false,
            type: null,
            data: null,
        });
    }, []);

    return {
        modal,
        openModal,
        closeModal,
    };
};

export default useModal;
