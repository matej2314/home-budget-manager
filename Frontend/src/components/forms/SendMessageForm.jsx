import { useRef, useState } from "react";
import sendRequest from '../../utils/sendRequest';
import { serverUrl } from '../../url';

export default function SendMessageForm() {

    const [sended, setSended] = useState(false);

    const recipientName = useRef();
    const messageContent = useRef();

    const handleSendMessage = async (e) => {
        e.preventDefault();

        const messageData = {
            recipientName: recipientName.current.value,
            content: messageContent.current.value,
        };

        try {
            setSended(false);
            const sendMessage = await sendRequest('POST', messageData, `${serverUrl}/message/send`);

            if (sendMessage.status === 'success') {
                alert(sendMessage.message);
            }
        } catch (error) {
            console.log(error.message);
        } finally {
            setSended(true);
        }
    };

    return (
        <div className="w-full h-full flex flex-col justify-center items-center gap-4">
            <h2 className="text-2xl mb-2">Send message</h2>
            <form onSubmit={handleSendMessage} className="w-full h-full flex flex-col items-center justify-center gap-3">
                <label className="w-full h-fit flex justify-center" htmlFor="recipientName">Type recipient name:</label>
                <input className="w-1/2" type="text" name="recipientName" id="recipientName" ref={recipientName} required />
                <label className="w-full h-fit flex justify-center" htmlFor="messageContent">Type your message:</label>
                <textarea className="w-1/2" name="messageContent" id="messageContent" ref={messageContent} resize={false} />
                <button type="submit" className="bg-slate-400/75 p-2 rounded-xl hover:bg-slate-300" disabled={sended}>Send message</button>
            </form>
        </div>
    )


}