import { useState, useContext, useEffect } from 'react';
import { DataContext } from '../../store/dataContext';
import localizer from '../../configs/calendarLocalizer';
import { Calendar } from 'react-big-calendar';
import DashboardHeader from '../../components/dashboard/dashboardComponents/DashBoardHeader';
import CalendarModal from '../../components/modals/CalendarModal';
import 'react-big-calendar/lib/css/react-big-calendar.css';


export default function CalendarPage() {
    const { actionsData, isTransactionsFetched, actionsError, actionsLoading, fetchTransactions } = useContext(DataContext);

    useEffect(() => {
        if (!isTransactionsFetched) {
            fetchTransactions();
        }
    }, [isTransactionsFetched]);

    const transactions = !actionsError && !actionsLoading && isTransactionsFetched && actionsData || [];

    const events = transactions.map(transaction => {
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

    const [selectedEvent, setSelectedEvent] = useState(null);
    const [view, setView] = useState('month');
    const [selectedDate, setSelectedDate] = useState(null);

    const handleEventClick = (event) => {
        setSelectedEvent(event);
    };

    const handleDateClick = (date) => {
        const eventsOnDate = events.filter(event =>
            event.start.toLocaleDateString() === date.toLocaleDateString()
        );
        setSelectedDate({ date, events: eventsOnDate });
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
                    messages={{
                        today: 'Dziś',
                        previous: 'Poprzedni',
                        next: 'Następny',
                        month: 'Miesiąc',
                        week: 'Tydzień',
                        day: 'Dzień',
                        agenda: 'Agenda',
                        date: 'Data',
                        time: 'Czas',
                        weekday: {
                            Monday: 'Poniedziałek',
                            Tuesday: 'Wtorek',
                            Wednesday: 'Środa',
                            Thursday: 'Czwartek',
                            Friday: 'Piątek',
                            Saturday: 'Sobota',
                            Sunday: 'Niedziela',
                        }
                    }}
                />
            </div>
            {selectedEvent && <CalendarModal selectedEvent={selectedEvent} handleCloseModal={handleCloseModal} />}
        </div>
    );
}
