import { t } from 'i18next';
import { showInfoToast, showErrorToast } from "../../configs/toastify"
import sendRequest from './sendRequest';
import { serverUrl } from "../../url";

export const markMessage = async (message, user, refreshData, mode) => {
    const tCommon = (key, options = {}) => t(key, { ns: 'common', ...options });

    if (user.userName !== message.recipient && mode && mode !== 'open') {
        showErrorToast(tCommon("receiverErrorMsg"));
        return;
    } else if (user.userName === message.recipient) {
        const markMessage = await sendRequest('PUT', { messageId: message.id }, `${serverUrl}/message/readed`);

        if (markMessage.status === 'error') {
            showErrorToast(tCommon("markErrorMsg"));

        } else if (markMessage.status === 'success') {
            showInfoToast(tCommon("markSuccessMsg"));
            setTimeout(() => {
                refreshData();
            }, 1000);
        };
    };
};