import moment from 'moment';
import { Calendar, momentLocalizer } from 'react-big-calendar';

moment.updateLocale('en', {
    week: {
        dow: 1,
    }
})

const localizer = momentLocalizer(moment);

export default localizer;
