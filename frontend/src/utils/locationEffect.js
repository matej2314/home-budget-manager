import { messagesStates } from "./arraysUtils/messagesMapArrays";

export const locationEffect = (link, location) => {

    if (
        location.pathname === link.path ||
        location.pathname === `/dashboard/${link.path}` ||
        messagesStates.some(param => location.pathname === `/dashboard/${link.path}/${param}`)
    ) {
        return "nav-link-active text-white";
    };
};
