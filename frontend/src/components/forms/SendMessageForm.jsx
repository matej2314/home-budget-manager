import { useContext, useMemo, useRef, useState } from 'react';
import { useMessagesStore } from '../../store/messagesStore';
import { DataContext } from '../../store/dataContext';
import { useAuth } from '../../store/authContext';
import sendRequest from '../../utils/asyncUtils/sendRequest';
import { apiBaseUrl } from '../../url';
import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';
import { showInfoToast, showErrorToast } from '../../configs/toastify';
import useApiResponseHandler from '../../hooks/useApiResponseHandler';
import SendMessageBtn from './internal/SendMessageBtn';
import LoadingModal from '../modals/LoadingModal';
import { isNoSQL, isNoXSS, isValidUsername } from '../../utils/validation';
import { getData } from '../../utils/getData';

export default function SendMessageForm({ reply, recipientName, onClose, embedded = false }) {
	const [isLoading, setIsLoading] = useState(false);
	const [actionState, setActionState] = useState({ type: null });
	const { fetchMessages } = useMessagesStore();
	const { data, isLoading: dataLoading, dataError } = useContext(DataContext);
	const { user } = useAuth();
	const handleApiResponse = useApiResponseHandler();
	const { t } = useTranslation("forms");
	const recipientRef = useRef();
	const messageContentRef = useRef();

	const housemateLogins = useMemo(() => {
		const mates = getData(dataLoading, dataError, true, data?.houseMates, []);
		return mates
			.map((mate) => mate.userName)
			.filter((name) => name && name !== user?.userName);
	}, [data?.houseMates, dataLoading, dataError, user?.userName]);

	const handleSetActionState = (action) => {
		setActionState({ type: action });
	};

	const handleResetActionState = () => {
		setActionState({ type: null });
	};

	const handleSendMessage = async (e) => {
		e.preventDefault();

		const recipient = recipientRef.current.value;
		const message = messageContentRef.current.value;

		const validRecipient = recipient && isValidUsername(recipient) && !isNoSQL(recipient);
		const validMessage = message && !isNoSQL(message) && !isNoXSS(message);

		const messageData = {
			recipientName: validRecipient,
			content: validMessage,
		};

		try {
			setIsLoading(true);
			const sendMessage = await sendRequest('POST', messageData, `${apiBaseUrl}/message/send`);

			await handleApiResponse(sendMessage, {
				onSuccess: async () => {
					showInfoToast(t(sendMessage.message, { defaultValue: "sendMessage.successMessage" }));
					await fetchMessages();
					messageContentRef.current.value = '';
					setTimeout(onClose, 600);
				},
				onError: () => {
					showErrorToast(t(sendMessage.message, { defaultValue: "sendMessage.errorMessage" }));
				}
			});
		} catch {
			showErrorToast(t("sendMessage.errorMessage"));
		} finally {
			handleSetActionState('sended');
			setIsLoading(false);
		}
	};

	return (
		<div className={`w-full flex flex-col ${embedded ? 'gap-4' : 'items-center gap-4 max-w-md mx-auto'}`}>
			{!embedded && (
				<h2 className="text-xl font-semibold text-ink mb-1">
					{reply ? t("sendMessage.formHeaderReply") : t("sendMessage.formHeaderSend")}
				</h2>
			)}
			<form onSubmit={handleSendMessage} className="w-full flex flex-col gap-4">
				{recipientName ? (
					<input type="hidden" name="recipientName" id="recipientName" ref={recipientRef} defaultValue={recipientName} />
				) : (
					<>
						<label className="text-sm font-medium text-ink" htmlFor="recipientName">
							{t("sendMessage.recipientNameLabel")}
						</label>
						<select
							name="recipientName"
							id="recipientName"
							ref={recipientRef}
							required
							defaultValue=""
							className="input-base appearance-none pr-9 bg-white"
						>
							<option value="" disabled>
								{t("sendMessage.recipientNamePlaceholder")}
							</option>
							{housemateLogins.map((login) => (
								<option key={login} value={login}>
									{login}
								</option>
							))}
						</select>
						{!dataLoading && housemateLogins.length === 0 && (
							<p className="text-xs text-muted -mt-2">{t("sendMessage.noRecipients")}</p>
						)}
					</>
				)}

				<label className="text-sm font-medium text-ink" htmlFor="messageContent">
					{t("sendMessage.messageLabel")}
				</label>
				<div className="relative w-full">
					<textarea
						className="input-base min-h-[8rem] py-2.5 pr-9 resize-none"
						name="messageContent"
						id="messageContent"
						rows={5}
						placeholder={t("sendMessage.messagePlaceholder")}
						ref={messageContentRef}
						required
					/>
					<Icon icon="ic:outline-message" className="absolute right-2.5 top-2.5 pointer-events-none text-muted text-lg" />
				</div>
				<div className={`w-full flex ${embedded ? 'justify-end' : 'justify-center'} pt-1`}>
					<SendMessageBtn form="sendMessage" state={actionState} setState={handleSetActionState} resetState={handleResetActionState} />
				</div>
			</form>
			{isLoading && <LoadingModal isOpen={isLoading} />}
		</div>
	);
}
