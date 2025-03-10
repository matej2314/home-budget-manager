import { useRef, useState } from "react";
import { useMessagesStore } from '../../store/messagesStore';
import sendRequest from '../../utils/asyncUtils/sendRequest';
import { serverUrl } from '../../url';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { showInfoToast, showErrorToast } from '../../configs/toastify';
import SendMessageBtn from "./internal/SendMessageBtn";
import LoadingModal from '../modals/LoadingModal';

export default function SendMessageForm({ reply, recipientName, onClose }) {
    const [isLoading, setIsLoading] = useState(false);
    const [actionState, setActionState] = useState({ type: null });
    const { fetchMessages } = useMessagesStore();
    const recipientRef = useRef();
    const messageContentRef = useRef();

    const handleSetActionState = (action) => {
        setActionState({ type: action });
    };

    const handleResetActionState = () => {
        setActionState({ type: null });
    }

    const handleSendMessage = async (e) => {
        e.preventDefault();

        const messageData = {
            recipientName: recipientRef.current.value,
            content: messageContentRef.current.value,
        };

        try {
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
            handleSetActionState('sended');
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
                className=" w-9/12 indirectxl:w-7/12 md:w-5/12 lg:w-4/12 xl:w-7/12 h-full flex flex-col items-center justify-center gap-3"
            >
                <label className="w-full h-fit flex justify-center" htmlFor="recipientName">Type recipient name:</label>
                <div className="relative w-full flex justify-center">
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
                        className="icon-base top-0.5 text-gray-500 text-xl text-opacity-40"
                    />
                </div>
                <label className="w-full h-fit flex justify-center" htmlFor="messageContent">Type your message:</label>
                <div className="relative w-full flex justify-center">
                    <textarea
                        className="resize-none w-full pl-2 rounded-md border-b-[1px] border-t-[1px] border-slate-300 shadow-sm shadow-slate-500"
                        name="messageContent"
                        id="messageContent"
                        placeholder="message"
                        ref={messageContentRef}
                        required
                    />
                    <Icon
                        icon='uiw:message'
                        className="absolute right-1 pointer-events-none top-0.5 text-slate-600 text-xl text-opacity-45"
                    />
                </div>
                <SendMessageBtn form='sendMessage' state={actionState} setState={handleSetActionState} resetState={handleResetActionState} />
            </form>
            {isLoading && <LoadingModal isOpen={isLoading} />}
        </div>
    );
}
