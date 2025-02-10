import { useRef, useState } from "react";
import sendRequest from '../../utils/sendRequest';
import { serverUrl } from '../../url';
import { showInfoToast, showErrorToast } from '../../configs/toastify';
import LoadingModal from '../modals/LoadingModal';

export default function SendMessageForm({ reply, recipientName, onClose }) {
    const [sended, setSended] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
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
                <input
                    type="text"
                    name="recipientName"
                    id="recipientName"
                    ref={recipientRef}
                    defaultValue={recipientName || ""}
                    required
                    disabled={recipientName}
                    className={`${recipientName ? "bg-gray-300 cursor-not-allowed" : ""} w-1/2 pl-2`}
                />

                <label className="w-full h-fit flex justify-center" htmlFor="messageContent">Type your message:</label>
                <textarea
                    className="w-1/2 resize-none"
                    name="messageContent"
                    id="messageContent"
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
