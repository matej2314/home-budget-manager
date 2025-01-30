import { toast } from 'react-toastify';
import { Icon } from '@iconify/react';
import "react-toastify/dist/ReactToastify.css";

toast.message = (message, options = {}) => {
    return toast(message, {
        ...options,
        position: 'top-right',
        autoClose: 3000,
        closeButton: false,
        hideProgressBar: false,
        draggable: false,
        render: () => (
            <div className={`flex items-center ${baseStyles}`}>
                <Icon icon="icon-park-outline:message" className="mr-2 text-blue-600/75" />
                <span>{message}</span>
            </div>
        ),
    })
}

const baseStyles = 'p-4 rounded-lg shadow-md text-slate-700';

const toastStyles = {
    success: ``,
    error: ``,
    info: ``,
    message: ''
};

export const showSuccessToast = (message) => {
    toast.success(message, {
        className: toastStyles.success
    });
};

export const showErrorToast = (message) => {
    toast.error(message, {
        className: toastStyles.error
    });
};

export const showInfoToast = (message) => {
    toast.info(message, {
        className: toastStyles.info
    });
};

export const showMessageToast = (message) => {
    toast.message(message, {
        className: toastStyles.message
    })
}