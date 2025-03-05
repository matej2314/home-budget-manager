import { useRef, useState } from "react";
import { useMessagesStore } from '../../store/messagesStore';
import sendRequest from '../../utils/asyncUtils/sendRequest';
import { serverUrl } from '../../url';
import { Icon } from '@iconify/react';
import { showInfoToast, showErrorToast } from '../../configs/toastify';

export default function SendMessageForm({ reply, recipientName, onClose }) {
    const [sended, setSended] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { fetchMessages } = useMessagesStore();
    const recipientRef = useRef();
    const messageContentRef = useRef();

    const handleSendMessage = async (e) => {
        e.preventDefault();

        const messageData = {
            recipientName: recipientRef.current.value,
            content: messageContentRef.current.value,
        };

        try {
            setSended(false);
            setIsLoading(true);
            const sendMessage = await sendRequest('POST', messageData, `${serverUrl}/message/send`);

            if (sendMessage.status === 'success') {
                showInfoToast(sendMessage.message);
                await fetchMessages();
                messageContentRef.current.value = "";
                setTimeout(() => {
                    onClose();
                }, 600);
            }
        } catch (error) {
            showErrorToast(sendMessage.message);
        } finally {
            setSended(true);
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full h-full flex flex-col justify-center items-center gap-4">
            <h2 className="text-2xl mb-2">
                {reply ? 'Reply message' : 'Send message'}
            </h2>
            <form
                onSubmit={handleSendMessage}
                className="w-full h-full flex flex-col items-center justify-center gap-3"
            >
                <label className="w-full h-fit flex justify-center" htmlFor="recipientName">Type recipient name:</label>
                <div className="relative w-fit flex justify-center">
                    <input
                        type="text"
                        name="recipientName"
                        id="recipientName"
                        placeholder="recipient name"
                        ref={recipientRef}
                        defaultValue={recipientName || ""}
                        required
                        disabled={recipientName}
                        onInput={(e) => e.target.nextSibling.style.display = e.target.value ? 'none' : 'block'}
                        className={`${recipientName ? "bg-gray-300 cursor-not-allowed" : ""} input-base`}
                    />
                    <Icon
                        icon='mage:user-fill'
                        className="icon-base text-gray-500 text-xl text-opacity-40"
                    />
                </div>
                <label className="w-full h-fit flex justify-center" htmlFor="messageContent">Type your message:</label>
                <textarea
                    className=" md:w-1/2 resize-none input-base"
                    name="messageContent"
                    id="messageContent"
                    placeholder="message"
                    ref={messageContentRef}
                    required
                />

                <button
                    type="submit"
                    className="form-submit-modal-btn"
                    disabled={sended}>
                    Send message
                </button>
            </form>
        </div>
    );
}
