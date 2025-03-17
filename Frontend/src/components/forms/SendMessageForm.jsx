import { useRef, useState } from 'react';
import { useMessagesStore } from '../../store/messagesStore';
import sendRequest from '../../utils/asyncUtils/sendRequest';
import { serverUrl } from '../../url';
import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';
import { showInfoToast, showErrorToast } from '../../configs/toastify';
import SendMessageBtn from './internal/SendMessageBtn';
import LoadingModal from '../modals/LoadingModal';

export default function SendMessageForm({ reply, recipientName, onClose }) {
	const [isLoading, setIsLoading] = useState(false);
	const [actionState, setActionState] = useState({ type: null });
	const { fetchMessages } = useMessagesStore();
	const { t } = useTranslation("forms");
	const recipientRef = useRef();
	const messageContentRef = useRef();

	const handleSetActionState = (action) => {
		setActionState({ type: action });
	};

	const handleResetActionState = () => {
		setActionState({ type: null });
	};

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
				messageContentRef.current.value = '';
				setTimeout(() => {
					onClose();
				}, 600);
			}
		} catch (error) {
			showErrorToast('Failed to send message.');
		} finally {
			handleSetActionState('sended');
			setIsLoading(false);
		}
	};

	return (
		<div className="w-8/12 xl:w-10/12 h-full flex flex-col justify-center items-center gap-4">
			<h2 className="text-xl xl:text-2xl mb-2">{reply ? t("sendMessage.formHeaderReply") : t("sendMessage.formHeaderSend")}</h2>
			<form onSubmit={handleSendMessage} className="w-full h-full flex flex-col items-center justify-center gap-3">
				<label className="w-full h-fit flex justify-center" htmlFor="recipientName">
					{t("sendMessage.recipientNameLabel")}
				</label>
				<div className="relative w-fit flex justify-center">
					<input
						type="text"
						name="recipientName"
						id="recipientName"
						placeholder={t("sendMessage.recipientNamePlaceholder")}
						ref={recipientRef} defaultValue={recipientName || ''}
						required disabled={recipientName} onInput={(e) => (e.target.nextSibling.style.display = e.target.value ? 'none' : 'block')}
						className={`${recipientName ? 'bg-gray-300 cursor-not-allowed' : ''} input-base`} />
					<Icon icon="mage:user-fill" className="icon-base top-0.5 text-gray-500 text-xl text-opacity-40" />
				</div>
				<label className="w-full h-fit flex justify-center" htmlFor="messageContent">
					{t("sendMessage.messageLabel")}
				</label>
				<div className="relative w-[13rem] indirect:w-full indirectxl:w-10/12  sm:w-9/12 md:w-8/12 lg:w-6/12 xl:w-11/12 flex justify-center">
					<textarea
						className=" resize-none input-base"
						name="messageContent"
						id="messageContent"
						placeholder={t("sendMessage.messagePlaceholder")}
						ref={messageContentRef}
						required />
					<Icon icon="ic:outline-message" className="absolute right-1 pointer-events-none top-0.5 text-slate-600 text-xl text-opacity-45" />
				</div>
				<SendMessageBtn form="sendMessage" state={actionState} setState={handleSetActionState} resetState={handleResetActionState} />
			</form>
			{isLoading && <LoadingModal isOpen={isLoading} />}
		</div>
	);
}
