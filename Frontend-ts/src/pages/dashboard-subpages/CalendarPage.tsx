import { useState, useEffect } from 'react';
import { useTransactionsStore } from '@store/transactionsStore';
import { getCalendarLocalizer } from '@configs/calendarLocalizer';
import { useTranslation } from 'react-i18next';
import { Calendar, type SlotInfo, View } from 'react-big-calendar';
import DashboardHeader from '@components/dashboard/dashboardComponents/DashboardHeader';
import useDocumentTitle from '@hooks/useDocumentTitle';
import CalendarModal from '@components/modals/CalendarModal';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { type Transaction } from '@models/transactionsStoreTypes';
import i18n from '@configs/i18n';
import { calendarMessages } from '@utils/calendarMessages';

interface Event {
    title: string;
    start: Date;
    end: Date;
    allDay: boolean;
    details: Transaction;
};


export default function CalendarPage() {
    const { actionsData, isTransactionsFetched, actionsDataError, actionsLoading, fetchTransactions } = useTransactionsStore();
    const [selectedEvent, setSelectedEvent] = useState<Event | null>();
    const [view, setView] = useState<View>('month');
    const [selectedDate, setSelectedDate] = useState<Event[] | null>(null);
    useDocumentTitle('Calendar');
    const  {i18n}  = useTranslation();
    const lang = i18n.language;

    const localizer = getCalendarLocalizer(lang);
    const messages = calendarMessages[lang === 'pl' ? 'pl' : 'en'];

    useEffect(() => {
        if (!isTransactionsFetched) {
            fetchTransactions(1);
        }
    }, [isTransactionsFetched]);

    const transactions: Transaction[] = !actionsDataError && !actionsLoading && isTransactionsFetched && actionsData || [];

    const events: Event[] = transactions.map(transaction => {
        const startDate = new Date(transaction.addedAt);
        const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
        return {
            title: `Transakcja: ${transaction.categoryName}-${transaction.type}-${transaction.type === 'income' ? transaction.value : -transaction.value}-${transaction.userName}`,
            start: startDate,
            end: endDate,
            allDay: false,
            details: transaction,
        };
    });



    const handleEventClick = (event: Event) => {
        setSelectedEvent(event);
    };

    const handleDateClick = (slotInfo: SlotInfo) => {
        const clickedDate = new Date(slotInfo.start);
        const eventsOnDate = events.filter(event =>
            event.start.toLocaleDateString() === clickedDate.toLocaleDateString()
        );
        setSelectedDate(eventsOnDate);
    };

    const handleCloseModal = () => {
        setSelectedEvent(null);
    };

    return (
        <div id="pagecontent" className="w-full min-h-screen bg-slate-200 flex flex-col gap-5 items-stretch z-0">
            <DashboardHeader />
            <div style={{ height: '500px', width: '97%', marginInline: 'auto' }}>
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    className="h-[550px] border-[2px] border-slate-300 rounded-md gap-2"
                    onSelectEvent={handleEventClick}
                    onSelectSlot={handleDateClick}
                    onView={setView}
                    formats={{
                        timeGutterFormat: 'HH:mm',
                        dayHeaderFormat: 'dddd, MMMM DD',
                        agendaTimeFormat: 'HH:mm',
                        dayFormat: 'ddd',
                    }}
                    messages={messages}
                />
            </div>
            {selectedEvent && <CalendarModal selectedEvent={selectedEvent} handleCloseModal={handleCloseModal} />}
        </div>
    );
}
