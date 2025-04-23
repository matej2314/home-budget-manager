import { toast} from 'react-toastify';
import { Icon } from '@iconify/react';
import 'react-toastify/dist/ReactToastify.css';
import { ReactNode} from 'react';

type ToastMessage = string | ReactNode | (() => string | ReactNode);

const toastStyles = {
    success: 'text-red-700',
    error: 'text-red-600',
    info: 'absolute w-5 h-fit text-xs md:text-base',
    message: ''
};

export const showSuccessToast = (message: ToastMessage): void => {
    toast.success(message, {
        className: toastStyles.success
    });
};

export const showErrorToast = (message: ToastMessage): void => {
    toast.error(message, {
        className: toastStyles.error,
        autoClose: 2000
    });
};

export const showInfoToast = (message: ToastMessage): void => {
    toast.info(message, {
        className: toastStyles.info,
        autoClose: 1000
    });
};

export const showMessageToast = (message: string): void => {
    toast(
        <div className="flex items-center">
            <Icon icon="icon-park-outline:message" className="mr-2 text-blue-600/75" />
            <span>{message}</span>
        </div>,
        {
            className: toastStyles.message,
            position: 'top-right'
        }
    );
};

export const showCookiesInfo = (part1: string, part2: string): void => {
    toast(
        <div className="w-full h-full flex justify-center items-center gap-3">
            <Icon icon="fluent:cookies-32-regular" width={75} height={75} color="#cda43c" />
            <div className="w-full lg:w-[600px] h-fit flex flex-col items-center gap-2">
                <p>{part1}</p>
                <p>{part2}</p>
            </div>
        </div>,
        {
            className: 'text-black h-full flex justify-center',
            position: 'bottom-center',
            autoClose: 1500,
            style: {
                width: '90%',
                maxWidth: '600px',
                height: 'auto',
                padding: '10px'
            }
        }
    );
};
