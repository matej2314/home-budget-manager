import { useState, useContext } from 'react';
import Modal from 'react-modal';
import { DataContext } from '../../store/dataContext';
import { Calendar } from 'react-big-calendar';
import localizer from '../../configs/calendarLocalizer';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import DashboardHeader from '../../components/dashboard/dashboardComponents/DashBoardHeader';

Modal.setAppElement('#root');

export default function CalendarPage() {
    const { data, isLoading, error } = useContext(DataContext);

    const transactions = !isLoading && !error && data.dashboardData.actionsData || [];

    const events = transactions.map(transaction => ({
        title: `Transakcja: ${transaction.categoryName}-${transaction.type}-${transaction.value}-${transaction.userName}`,
        start: new Date(transaction.addedAt),
        allDay: false,
        details: transaction,
    }));

    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleEventClick = (event) => {
        setSelectedEvent(event);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedEvent(null);
    };

    return (
        <div id="pagecontent" className="w-full min-h-screen bg-slate-200 flex flex-col gap-5 items-stretch">
            <DashboardHeader />
            <div style={{ height: '500px', width: '97%' }}>
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="start"
                    className='h-[500px] border-[2px] border-slate-300 rounded-md'
                    onSelectEvent={handleEventClick}
                />
            </div>
        </div>
    );
}
