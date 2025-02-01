import { showInfoToast, showErrorToast } from "../configs/toastify"
import sendRequest from './sendRequest';
import { serverUrl } from "../url";

export const markMessage = async (message, user, refreshData) => {
    if (user.userName !== message.recipient) {
        showErrorToast('Nie jesteś odbiorcą tej wiadomości!');
        return;
    } else if (user.userName === message.recipient) {
        const markMessage = await sendRequest('PUT', { messageId: message.id }, `${serverUrl}/message/readed`);

        if (markMessage.status === 'error') {
            showErrorToast(markMessage.message);

        } else if (markMessage.status === 'success') {
            showInfoToast(markMessage.message);
            setTimeout(() => {
                refreshData();
            }, 1000);
        };
    };
}