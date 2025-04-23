import { t } from 'i18next';
import { showInfoToast, showErrorToast } from '@configs/toastify';
import sendRequest from './sendRequest';
import { serverUrl } from 'url';
import { type Message } from '@utils/arraysUtils/messagesBtnsArray';
import { type User } from '@models/authTypes';

type MarkMessageResponse = {
    status: 'error' | 'success';
    message: string;
};

export const markMessage = async (message: Message, user: User, refreshData: (page: number) => void, mode: string) => {
    const tCommon = (key: string, options = {}) => t(key, { ns: 'common', ...options });

    if (user.userName !== message.recipient && mode && mode !== 'open') {
        showErrorToast(tCommon("receiverErrorMsg"));
        return;
    } else if (user.userName === message.recipient) {
        try {
            
            const markMessage = await sendRequest<{ messageId: string }, MarkMessageResponse>(
                'PUT', 
                { messageId: message.id },
                `${serverUrl}/message/readed`
            );

            // Obsługa odpowiedzi
            if (markMessage.status === 'success') {
                showInfoToast(tCommon("messageMarkedAsRead"));
                refreshData(1);
            } else {
                showErrorToast(markMessage.message || tCommon("generalErrorMsg"));
            }
        } catch (error) {
            showErrorToast(tCommon("networkErrorMsg"));
        }
    }
};
