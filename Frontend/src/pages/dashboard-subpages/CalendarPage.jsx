import { Calendar } from 'react-big-calendar';
import localizer from '../../configs/calendarLocalizer';
import 'react-big-calendar/lib/css/react-big-calendar.css';

export default function CalendarPage() {
    const events = [
        {
            title: 'Zakupy spożywcze',
            start: new Date(2025, 0, 15, 10, 0),
            allDay: false,
        },
        {
            title: 'Spotkanie z przyjaciółmi',
            start: new Date(2025, 0, 16, 19, 0),
            allDay: false,
        },
    ];

    return (
        <div style={{ height: '500px' }}>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="start"
                style={{ height: 500 }}
            />
        </div>
    );
}
