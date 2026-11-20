import { useAuth } from '../../../store/authContext';
import { useMessagesStore } from '../../../store/messagesStore';
import AppModal from '../AppModal';
import ModalHeader from '../ModalHeader';
import SendMessageForm from '../../forms/SendMessageForm';
import { apiBaseUrl } from '../../../url';
import sendRequest from '../../../utils/asyncUtils/sendRequest';
import { showInfoToast, showErrorToast } from '../../../configs/toastify';
import useApiResponseHandler from '../../../hooks/useApiResponseHandler';
import { useTranslation } from 'react-i18next';
import { Icon } from '@iconify/react';

export function SendMessageModal({ isOpen, onRequestClose, recipient }) {
	const { t } = useTranslation("forms");

	return (
		<AppModal
			isOpen={isOpen}
			onRequestClose={onRequestClose}
			contentLabel={t("sendMessage.formHeaderSend")}
			className="modal-panel max-w-md"
		>
			<ModalHeader
				title={t("sendMessage.formHeaderSend")}
				subtitle={recipient ? (
					<>→ <span className="font-medium text-ink">{recipient}</span></>
				) : null}
				onClose={onRequestClose}
			/>
			<SendMessageForm
				reply={false}
				recipientName={recipient}
				onClose={onRequestClose}
				embedded
			/>
		</AppModal>
	);
}

export function DeleteMessageModal({ isOpen, onRequestClose, message }) {
	const { t } = useTranslation("modals");
	const handleApiResponse = useApiResponseHandler();
	const { fetchMessages } = useMessagesStore();

	const handleDeleteMessage = async (messageId) => {
		const delData = {
			messageId: messageId,
		};
		const result = await sendRequest('DELETE', delData, `${apiBaseUrl}/message/delete`);

		handleApiResponse(result, {
			onSuccess: async () => {
				showInfoToast(t("deleteMessage.deletedCorrectlyMessage"));
				await fetchMessages();
				onRequestClose();
			},
			onError: () => {
				showErrorToast(t("deleteMessage.errorMessage"));
			}
		});
	};

	return (
		<AppModal
			isOpen={isOpen}
			onRequestClose={onRequestClose}
			contentLabel={t("deleteMessage.confirmQuestion")}
			className="modal-panel"
		>
			<ModalHeader title={t("deleteMessage.confirmQuestion")} onClose={onRequestClose} />
			<p className="text-sm text-ink wrap-break-word">
				<span className="text-muted">„</span>{message.message}<span className="text-muted">”</span>
			</p>
			<div className="modal-actions-center">
				<button type="button" className="form-submit-modal-btn" onClick={() => handleDeleteMessage(message.id)}>
					{t("btnYes")}
				</button>
				<button onClick={onRequestClose} type="button" className="modal-btn-secondary">
					{t("btnNo")}
				</button>
			</div>
		</AppModal>
	);
}

export function DisplayMessageDetails({ isOpen, onRequestClose, message }) {
	const { user } = useAuth();
	const { t } = useTranslation("modals");

	return (
		<AppModal
			isOpen={isOpen}
			onRequestClose={onRequestClose}
			contentLabel={t("messageDetails.heading")}
			className="modal-panel max-w-lg"
		>
			<ModalHeader title={t("messageDetails.heading")} onClose={onRequestClose} />
			<div className="flex flex-col gap-4 pb-4 border-b border-slate-200">
				<div>
					<label className="text-sm font-medium text-ink" htmlFor="senderName">
						{t("messageDetails.senderLabel")}
					</label>
					<div className="relative mt-1.5">
						<input className="input-base pr-9 bg-page" type="text" name="senderName" id="senderName" defaultValue={message.sender} disabled />
						<Icon icon="mage:user-fill" className="icon-base top-2.5 text-accent text-lg" />
					</div>
				</div>
				<div>
					<label className="text-sm font-medium text-ink" htmlFor="recipientName">
						{t("messageDetails.receiverLabel")}
					</label>
					<div className="relative mt-1.5">
						<input className="input-base pr-9 bg-page" type="text" name="recipientName" id="recipientName" defaultValue={message.recipient} disabled />
						<Icon icon="mage:user-fill" className="icon-base top-2.5 text-emerald-600 text-lg" />
					</div>
				</div>
				<div>
					<label className="text-sm font-medium text-ink" htmlFor="receivedMessage">
						{t("messageDetails.messageLabel")}
					</label>
					<textarea
						className="input-base w-full mt-1.5 min-h-[6rem] py-2.5 resize-none bg-page"
						name="receivedMessage"
						rows={4}
						id="receivedMessage"
						defaultValue={message.message}
						disabled
					/>
				</div>
			</div>
			{user.userName !== message.sender && (
				<div className="mt-5">
					<SendMessageForm reply={true} recipientName={message.sender} onClose={onRequestClose} embedded />
				</div>
			)}
		</AppModal>
	);
}

export function ReplyMessageModal({ isOpen, onRequestClose, message }) {
	const { t } = useTranslation("forms");
	const recipientName = (isOpen && message && message.sender) || null;

	return (
		<AppModal
			isOpen={isOpen}
			onRequestClose={onRequestClose}
			contentLabel={t("sendMessage.formHeaderReply")}
			className="modal-panel max-w-md"
		>
			<ModalHeader
				title={t("sendMessage.formHeaderReply")}
				subtitle={recipientName ? (
					<>→ <span className="font-medium text-ink">{recipientName}</span></>
				) : null}
				onClose={onRequestClose}
			/>
			<SendMessageForm reply={true} recipientName={recipientName} onClose={onRequestClose} embedded />
		</AppModal>
	);
}
