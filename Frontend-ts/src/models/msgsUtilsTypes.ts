import { type Message } from "@utils/arraysUtils/messagesBtnsArray";

export type ActionType = 'open' | 'delete' | 'mark' | 'reply';

export type OpenModalFn = (type: 'delete' | 'reply', message: Message) => void;

export type HandleMessageFn = (action: 'mark' | 'open', message: Message) => void;