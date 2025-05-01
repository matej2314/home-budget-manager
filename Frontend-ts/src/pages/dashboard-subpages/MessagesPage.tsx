import { useEffect } from "react";
import { useMessagesStore } from '@store/messagesStore';
import { useTranslation } from "react-i18next";
import useDocumentTitle from '@hooks/useDocumentTitle';
import DashboardHeader from "@components/dashboard/dashboardComponents/DashboardHeader";
import MessagesList from '@components/dashboard/dashboard-internal-components/MessagesList';
import LoadingModal from "@components/modals/LoadingModal";

export default function MessagesPage() {
    useDocumentTitle('Inbox');
    const { t } = useTranslation("pages");

    const {
        messagesData,
        messagesLoading,
        messagesError,
        fetchMessages,
        messagesTotalPages
    } = useMessagesStore();

    useEffect(() => {
        fetchMessages(1);
    }, [fetchMessages]);

    return (
        <>
            {messagesData && <div id="pagecontent" className="h-screen bg-slate-200 overflow-y-hidden">
                <DashboardHeader />
                <div
                    id="middle-content"
                    className=" min-h-full flex flex-col items-center border-2 border-b-slate-800/5 pb-4 overflow-auto">
                    <h2 className="min-w-full h-fit flex justify-center text-2xl">{t("messagesPage.title")}</h2>
                    {messagesData && <MessagesList
                        userMessages={messagesData}
                        messagesError={messagesError}
                        loading={messagesLoading}
                        getMessages={fetchMessages}
                        messagesPages={messagesTotalPages}
                    />}
                </div>
                {messagesLoading && <LoadingModal isOpen={messagesLoading} />}
            </div>}
        </>
    );
}
