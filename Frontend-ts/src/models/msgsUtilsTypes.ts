import { type Message } from '@models/messagesStoreTypes';

export type ActionType = string;

export type OpenModalFn = (type: 'delete' | 'reply', message: Message) => void;

export type HandleMessageFn = (action: 'mark' | 'open', message: Message) => void;