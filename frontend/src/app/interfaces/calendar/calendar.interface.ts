import { DateTime } from 'luxon';

export interface IMonthCalendar {
  fullDate: DateTime;
  dayName: string;
  currentMonth: boolean;
  currentDate: boolean;
  events: ICalendarEvent[];
}

export  interface IWeekCalendar {
  day: string;
  fullDate: DateTime;
  currentMonth: boolean;
  currentDate: boolean;
  events: ICalendarEvent[];
}

export interface ICalendarEvent {
  id: number;
  startDateTime: string;
  endDateTime: string;
  title: string;
  type: string;
  tooltip: string;
  diffMinutes?: number;
  startTime?: string;
  endTime?: string;
}
