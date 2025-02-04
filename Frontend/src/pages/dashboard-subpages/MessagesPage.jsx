import { useState } from "react";
import DashboardHeader from "../../components/dashboard/dashboardComponents/DashBoardHeader"
import MessagesList from '../../components/dashboard/dashboard-internal-components/MessagesList';

export default function MessagesPage() {

    return (
        <div id="pagecontent" className="min-h-screen w-screen bg-slate-200 overflow-y-hidden">
            <DashboardHeader />
            <div id="middle-content" className="min-w-full min-h-full flex flex-col gap-5 border-2 border-b-slate-800/5 py-4 mx-auto overflow-y">
                <h2 className="min-w-full h-fit flex justify-center text-2xl">Your messages:</h2>
                <MessagesList />
            </div>
        </div>
    )
}