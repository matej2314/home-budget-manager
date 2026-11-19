import moment from 'moment';
import { momentLocalizer } from 'react-big-calendar';
import 'moment/locale/pl';
import 'moment/locale/en-gb';
const userLanguage = navigator.language;
const languageCode = userLanguage.split('-')[0];

if (languageCode === 'pl') {
    moment.locale('pl');
} else if (languageCode === 'en') {
    moment.locale('en');
};

moment.updateLocale(moment.locale(), {
    week: {
        dow: 1,
    }
});

const localizer = momentLocalizer(moment);

export default localizer;
