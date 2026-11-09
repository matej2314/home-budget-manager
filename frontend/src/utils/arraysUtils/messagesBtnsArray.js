export const messagesBtnsArr = [
    { label: 'Open message', icon: "lets-icons:message-open-light", actionType: 'open' },
    { label: 'Delete message', icon: "mdi-light:delete", actionType: 'delete' },
    { label: 'Mark as readed', icon: "iconoir:mail-opened", actionType: 'mark' },
    { label: 'Reply', icon: "iconoir:reply-to-message", actionType: 'reply', condition: (message, user) => message.sender !== user.userName },
];