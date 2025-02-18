import { toast } from 'react-toastify';
import { Icon } from '@iconify/react';
import "react-toastify/dist/ReactToastify.css";

const baseStyles = 'p-4 rounded-lg shadow-md text-slate-700';

const toastStyles = {
    success: `text-red-700`,
    error: `color: #E91616`,
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

export const showCookiesInfo = (part1, part2) => {
    toast(
        <div className='w-full h-full flex justify-center items-center gap-3'>
            <Icon icon='fluent:cookies-32-regular' width={75} height={75} color='#cda43c' />
            <div className='w-full h-fit flex flex-col items-center gap-2'>
                <p>{part1}</p>
                <p>{part2}</p>
            </div>
        </div>, {
        className: 'text-black h-full flex justify-center',
        position: 'bottom-center',
        style: {
            width: '600px',
            height: '100px',
        }

    }
    )
}

