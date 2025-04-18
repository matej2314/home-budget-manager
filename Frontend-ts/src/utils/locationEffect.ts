import { messagesStates } from "./arraysUtils/messagesMapArrays";
import {type Location } from "react-router-dom";

type Link = {
    path: string;
};

export const locationEffect = (link: Link, location: Location): string | undefined => {
    const { pathname } = location;

    if (
        pathname === link.path || pathname === `dashboard/${link.path}` ||
        messagesStates.some(param => pathname === `/dashboard/${link.path}/${param}`)
    ) {
        return "text-slate-400";
    };
};