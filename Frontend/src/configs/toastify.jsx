import { toast } from 'react-toastify';
import { Icon } from '@iconify/react';
import "react-toastify/dist/ReactToastify.css";

const baseStyles = 'p-4 rounded-lg shadow-md text-slate-700';

const toastStyles = {
    success: `text-red-700`,
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
        className: toastStyles.error,
        autoClose: 2000,
    });
};

export const showInfoToast = (message) => {
    toast.info(message, {
        className: toastStyles.info,
        autoClose: 2000
    });
};

export const showMessageToast = (message) => {
    toast(
        <div className="flex items-center">
            <Icon icon="icon-park-outline:message" className="mr-2 text-blue-600/75" />
            <span>{message}</span>
        </div>, {
        className: toastStyles.message,
        position: 'top-right'
    }
    );
};

