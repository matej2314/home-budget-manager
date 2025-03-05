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
                <div className="relative w-1/2 flex justify-center">
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
                        className={`${recipientName ? "bg-gray-300 cursor-not-allowed" : ""} pl-2 border-2 border-slate-300 rounded-md`}
                    />
                    <Icon
                        icon='mage:user-fill'
                        className="absolute inset-y-1 left-[9rem] indirect:left-[10rem] indirectxl:left-[11.5rem] sm:left-[14rem] md:left-[15.5rem] lg:left-[18rem] xl:left-[11.5rem] text-gray-500 text-xl pointer-events-none text-opacity-40"
                    />
                </div>
                <label className="w-full h-fit flex justify-center" htmlFor="messageContent">Type your message:</label>
                <textarea
                    className="w-full md:w-1/2 resize-none border-2 border-slate-300 rounded-md pl-2"
                    name="messageContent"
                    id="messageContent"
                    placeholder="message"
                    ref={messageContentRef}
                    required
                />

                <button type="submit" className="bg-slate-300 p-2 rounded-xl hover:bg-slate-400/45 border-[1px] border-slate-500" disabled={sended}>
                    Send message
                </button>
            </form>
        </div>
    );
}
