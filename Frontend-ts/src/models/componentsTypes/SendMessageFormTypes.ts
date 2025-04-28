export type SendMessageFormInput = {
	reply: boolean;
	recipientName: string | null;
	onClose: () => void;
};

export type MessageData = {
	recipientName: string;
	content: string;
};