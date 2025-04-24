// @configs/calendarLocalizer.ts
import moment from 'moment';
import { momentLocalizer } from 'react-big-calendar';
import 'moment/locale/pl';
import 'moment/locale/en-gb';

export const getCalendarLocalizer = (lang: string) => {
  moment.locale(lang === 'pl' ? 'pl' : 'en-gb');
  return momentLocalizer(moment);
};
