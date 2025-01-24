import { useContext } from "react";
import { MessageContext } from "../../../store/messageContext";



export default function DisplayLiveBalance() {
    const { messages, isLoading, error } = useContext(MessageContext);
}