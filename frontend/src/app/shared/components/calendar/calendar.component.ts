import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  SimpleChanges,
  ViewChild, OnChanges
} from '@angular/core';
import { DateTime } from 'luxon';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { interval, startWith, Subject, take, takeUntil } from 'rxjs';
import { ICalendarEvent, IMonthCalendar, IWeekCalendar } from 'src/app/interfaces/calendar/calendar.interface';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ICalendarInterval } from '../../../interfaces/calendar/month-interval.interface';
import { IDoctorProgram } from '../../../interfaces/appointment/doctor-programs.interface';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, ButtonModule, ButtonGroupModule, TooltipModule, ProgressSpinnerModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild('weekCalendar') weekCalendar: ElementRef | undefined;

  @Input() events: ICalendarEvent[] = [];
  @Input() workingHours: IDoctorProgram[] = [];
  @Input() firstDayOfWeek: number = 1; // 0 = Sunday, 1 = Monday, etc.
  @Input() intervalDuration: number = 30; // minute
  @Input() selectedView: 'month' | 'week' | 'day' = 'week';
  @Input() loading: boolean = false;
  @Input() weekCalendarStartDay: string = '00:00';
  @Input() weekCalendarEndDay: string = '22:00';
  @Input() allowSelectWeekRange: boolean = false;
  @Input() allowChangeInterval: boolean = false;
  @Input() allowClickMonthDay: boolean = false;
  @Input() allowChangeView: boolean = false;

  @Output() clickMonthDay: EventEmitter<DateTime> = new EventEmitter<DateTime>();
  @Output() intervalChanged: EventEmitter<ICalendarInterval> = new EventEmitter<ICalendarInterval>();
  @Output() weekIntervalToAdd: EventEmitter<ICalendarInterval> = new EventEmitter<ICalendarInterval>();
  @Output() eventMenuClick: EventEmitter<{ event: Event, calendarEvent: ICalendarEvent }> = new EventEmitter<{
    event: Event,
    calendarEvent: ICalendarEvent
  }>();
  destroy$: Subject<void> = new Subject<void>();
  currentDateMonthCalendar: DateTime = DateTime.now();
  currentDateWeekCalendar: DateTime = DateTime.now();
  timeIntervals: string[] = [];
  weekDays: string[] = [];
  monthCalendar: IMonthCalendar[][] = [];
  weeksCalendar: IWeekCalendar[] = [];
  lineCurrentTime: { time: string, topPosition: number, currentTime: string } | null = null;
  focusedElementIndex: number = 0;
  cellHeight: number = 25;
  focusedCellElementCreation: boolean = false;
  newEventCellElement: HTMLElement | null = null;
  lastSelectedRange: number = 0;
  allowedWorkingHours: any = null;

  readonly DISABLED_CLASS: string = 'disabled';

  constructor(
    private renderer: Renderer2
  ) {
  }

  unFocus(): void {
    this.focusedCellElementCreation = false;
  }

  onEventClick(event: Event, calendarEvent: ICalendarEvent): void {
    this.eventMenuClick.emit({event, calendarEvent});
  }

  createCellEventElement(ref: HTMLTableCellElement, index: number): void {
    if (this.newEventCellElement) {
      this.newEventCellElement.remove();
    }

    const element: HTMLElement = this.renderer.createElement('div');
    element.classList.add('new-event-cell');
    element.innerHTML = 'Draft Appointment';
    element.style.pointerEvents = 'none';
    this.newEventCellElement = element;
    ref.appendChild(element);
    this.focusedElementIndex = index;
  }

  updateCellEventElement(ref: HTMLTableCellElement, index: number): void {
    const selectionRange: number = (index + 1 - this.focusedElementIndex) * this.cellHeight;
    if (this.lastSelectedRange === selectionRange) {
      return;
    }
    this.lastSelectedRange = selectionRange;

    if (selectionRange > 0) {
      const element: HTMLElement | null = this.newEventCellElement;
      if (element) {
        element.style.height = `${selectionRange}px`;
        this.newEventCellElement = element;
      }
    } else {
      this.createCellEventElement(ref, index);
    }
  }

  onWeekMouseUp(ref: HTMLTableCellElement, index: number, interval: DateTime): void {
    if (!this.allowSelectWeekRange || ref.className.indexOf(this.DISABLED_CLASS) > -1) {
      return;
    }
    const hoursToAdd: number = DateTime.fromFormat(this.weekCalendarStartDay, 'HH:mm').hour || 0;
    const startInterval: DateTime<boolean> = interval.plus({
      minute: this.intervalDuration * this.focusedElementIndex,
      hour: hoursToAdd
    });
    const endInterval: DateTime<boolean> = interval.plus({
      minute: (this.intervalDuration * index) + this.intervalDuration,
      hour: hoursToAdd
    });

    this.weekIntervalToAdd.emit({
      startDate: startInterval,
      endDate: endInterval
    });

    this.focusedCellElementCreation = false;
    if (this.newEventCellElement) {
      this.newEventCellElement.style.pointerEvents = 'auto';
      if (startInterval.toFormat('HH:mm') === endInterval.minus({minute: this.intervalDuration}).toFormat('HH:mm')) {
        this.newEventCellElement.innerHTML = '<div>Draft Appointment - ' + startInterval.toFormat('HH:mm') + ' - ' + endInterval.toFormat('HH:mm') + '</div>';
      } else {
        this.newEventCellElement.innerHTML = '<div>Draft Appointment</div> <sub>' + startInterval.toFormat('HH:mm') + ' - ' + endInterval.toFormat('HH:mm') + '</sub>';
      }
    }
    this.updateCellEventElement(ref, index);
  }

  onWeekMouseDown(ref: HTMLTableCellElement, index: number): void {
    if (!this.allowSelectWeekRange || ref.className.indexOf(this.DISABLED_CLASS) > -1) {
      return;
    }

    this.focusedCellElementCreation = true;
    this.createCellEventElement(ref, index);
  }

  onWeekMouseEnter(ref: HTMLTableCellElement, index: number): void {
    if (!this.focusedCellElementCreation || !this.allowSelectWeekRange || ref.className.indexOf(this.DISABLED_CLASS) > -1) {
      return;
    }
    this.updateCellEventElement(ref, index);
  }

  setTodayDate(): void {
    this.currentDateMonthCalendar = DateTime.now();
    this.currentDateWeekCalendar = DateTime.now();
    this.generateMonthlyCalendar(this.currentDateMonthCalendar);

    if (this.selectedView === 'day') {
      this.generateWeeklyCalendar(this.currentDateWeekCalendar, true);
    } else if (this.selectedView === 'week') {
      this.generateWeeklyCalendar(this.currentDateWeekCalendar.startOf('week'), false);
    }


    if (this.selectedView === 'month') {
      this.intervalChanged.emit(this.currentMonthIntervals());
    } else {
      this.intervalChanged.emit(this.currentWeekIntervals());
    }
  }

  viewMonth(): void {
    this.selectedView = 'month';
    this.intervalChanged.emit(this.currentMonthIntervals());
  }

  onClickMonthDay(dateTime: DateTime, clickable: boolean, dayName: string): void {
    if (this.allowClickMonthDay && clickable && (this.allowedWorkingHours && !this.allowedWorkingHours[dayName]['day_off'])) {
      this.clickMonthDay.emit(dateTime);
    }
  }

  viewDay() {
    this.scrollIntoHour();
    this.selectedView = 'day';
    this.generateWeeklyCalendar(this.currentDateWeekCalendar, true);
  }

  viewWeek(): void {
    this.scrollIntoHour();
    this.selectedView = 'week';
    this.intervalChanged.emit(this.currentWeekIntervals());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['events']) {
      this.generateWeekDays();
      this.generateMonthlyCalendar(this.currentDateMonthCalendar);
      if (this.selectedView === 'week') {
        this.generateWeeklyCalendar(this.currentDateWeekCalendar.startOf('week'), false);
      } else if (this.selectedView === 'day') {
        this.generateWeeklyCalendar(this.currentDateWeekCalendar, true);
      }
    }

    if (changes['workingHours']) {
      this.generateAvailableTime();
    }

    if (changes['weekCalendarStartDay'] || changes['weekCalendarEndDay']) {
      this.generateTimeIntervals();
    }
  }

  generateCurrentTimeLine(): { time: string, topPosition: number, currentTime: string } {
    const now = DateTime.now();
    const rounded: DateTime = now.set({
      minute: now.minute >= 0 && now.minute < this.intervalDuration ? 0 : this.intervalDuration,
      second: 0,
      millisecond: 0
    });

    let topPosition: number = (now.minute / this.intervalDuration) * 100;

    if (now.minute > 30) {
      // when the minute is greater than 30, we need to calculate the top position based on the next hour
      topPosition = (now.minute / (this.intervalDuration * 2)) * 100;
    }
    return {time: rounded.toFormat('HH:mm'), topPosition, currentTime: now.toFormat('HH:mm')};
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  generateAvailableTime(): void {
    if (this.workingHours.length === 0) {
      this.allowedWorkingHours = null;
      return;
    }

    const response: any = {};
    this.weekDays.forEach((day) => {
      if (!response[day]) { // if the day is missing we need to create it
        response[day] = {};
      }

      for (const time of this.timeIntervals) {
        if (!response[day][time]) {
          response[day][time] = this.workingHours.some((data: any) => {
            return data.day.toUpperCase() === day.toUpperCase() && DateTime.fromFormat(time, 'HH:mm').toMillis() >= DateTime.fromFormat(data.startTime, 'HH:mm').toMillis() && DateTime.fromFormat(time, 'HH:mm').toMillis() < DateTime.fromFormat(data.endTime, 'HH:mm').toMillis();
          })
        }
      }
      response[day]['day_off'] = Object.values(response[day]).every((value) => !value);

    });
    this.allowedWorkingHours = response;
  }

  ngOnInit(): void {
    interval(5000) // Emit every minute
    .pipe(
      takeUntil(this.destroy$),
      startWith(0) // Emit the first value immediately
    ).subscribe(() => {
      this.lineCurrentTime = this.generateCurrentTimeLine();
    });

    this.generateTimeIntervals();


    if (this.selectedView === 'month') {
      this.generateMonthlyCalendar(this.currentDateMonthCalendar);
      this.intervalChanged.emit(this.currentMonthIntervals());
    } else if (this.selectedView === 'week') {
      this.generateWeeklyCalendar(this.currentDateWeekCalendar.startOf('week'), false);
      this.intervalChanged.emit(this.currentWeekIntervals());
    } else if (this.selectedView === 'day') {
      this.generateWeeklyCalendar(this.currentDateWeekCalendar, true);
      this.intervalChanged.emit(this.currentWeekIntervals());
    }

    this.scrollIntoHour();
  }

  currentMonthIntervals(): ICalendarInterval {
    return {
      startDate: this.currentDateMonthCalendar.startOf('month'),
      endDate: this.currentDateMonthCalendar.endOf('month')
    }
  }

  currentWeekIntervals(): ICalendarInterval {
    return {
      startDate: this.currentDateWeekCalendar.startOf('week'),
      endDate: this.currentDateWeekCalendar.endOf('week')
    }
  }

  nextMonth(): void {
    this.currentDateMonthCalendar = this.currentDateMonthCalendar.plus({months: 1});
    this.generateMonthlyCalendar(this.currentDateMonthCalendar);
    this.intervalChanged.emit(this.currentMonthIntervals());
  }

  prevMonth(): void {
    this.currentDateMonthCalendar = this.currentDateMonthCalendar.minus({months: 1});
    this.generateMonthlyCalendar(this.currentDateMonthCalendar);
    this.intervalChanged.emit(this.currentMonthIntervals());
  }

  nextWeekOrDay(): void {
    this.scrollIntoHour();
    if (this.selectedView === 'day') {
      this.currentDateWeekCalendar = this.currentDateWeekCalendar.plus({day: 1});
      this.generateWeeklyCalendar(this.currentDateWeekCalendar, true);
    } else if (this.selectedView === 'week') {
      this.currentDateWeekCalendar = this.currentDateWeekCalendar.plus({week: 1});
      this.generateWeeklyCalendar(this.currentDateWeekCalendar, false);
    }
    this.intervalChanged.emit(this.currentMonthIntervals());
  }

  prevWeekOrDay(): void {
    this.scrollIntoHour();
    if (this.selectedView === 'day') {
      this.currentDateWeekCalendar = this.currentDateWeekCalendar.minus({day: 1});
      this.generateWeeklyCalendar(this.currentDateWeekCalendar, true);
    } else if (this.selectedView === 'week') {
      this.currentDateWeekCalendar = this.currentDateWeekCalendar.minus({week: 1});
      this.generateWeeklyCalendar(this.currentDateWeekCalendar, false);
    }
    this.intervalChanged.emit(this.currentMonthIntervals());
  }

  private scrollIntoHour(): void {
    interval(100)
    .pipe(
      take(1)
    )
    .subscribe(() => {
      this.weekCalendar?.nativeElement.getElementsByClassName('start-of-hour')[0]?.scrollIntoView();
    });
  }

  private generateWeekDays(): void {
    const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    this.weekDays = weekDays.slice(this.firstDayOfWeek).concat(weekDays.slice(0, this.firstDayOfWeek));
  }

  private groupEventsMap(events: ICalendarEvent[], date: DateTime): ICalendarEvent[] {
    const statuses: any = {};
    events.forEach((event: ICalendarEvent) => {

      if (!statuses[event.type]) {
        statuses[event.type] = 0;
      }
      statuses[event.type]++;
    });

    const response: ICalendarEvent[] = [];
    for (const status in statuses) {
      response.push({
        id: statuses['id'],
        startDateTime: date.toISODate() ?? '',
        endDateTime: date.toISODate() ?? '',
        title: ``,
        type: status,
        tooltip: `${statuses[status]} ${statuses[status] !== 1 ? 'Appointments' : 'Appointment'} in status ${status}`
      });
    }
    return response;
  }

  private generateMonthlyCalendar(currentDate: DateTime): void {
    this.monthCalendar = []; // Clear the array
    const firstDayOfMonth: DateTime = currentDate.startOf('month').startOf('week');

    let weekArray: IMonthCalendar[] = [];
    for (let i = 0; i < 7 * 6; i++) { // 7 days * 6 monthCalendar


      const date: DateTime = firstDayOfMonth.plus({days: i - 1 + this.firstDayOfWeek});


      const events: ICalendarEvent[] = this.events.filter((event: ICalendarEvent): boolean => date.toISODate() === DateTime.fromISO(event.startDateTime).toISODate());
      const dayObject: IMonthCalendar = {
        fullDate: date,
        currentMonth: date.month === currentDate.month,
        dayName: date.toFormat('cccc'),
        currentDate: date.toISODate() === DateTime.now().toISODate(),
        events: this.groupEventsMap(events, date)
      };

      weekArray.push(dayObject);
      if (weekArray.length === 7) {
        this.monthCalendar.push(weekArray);
        weekArray = []; // Clear the array
      }
    }
  }

  private generateWeeklyCalendar(currentDate: DateTime, displayOnlyOneDay: boolean): void {
    const currentDayName: string = currentDate.toFormat('cccc');
    const weeksCalendar: IWeekCalendar[] = [];
    let index = 0;
    this.weekDays
    .filter((day: string): boolean => (day === currentDayName && displayOnlyOneDay) || !displayOnlyOneDay)
    .forEach(day => {
      const date: DateTime = currentDate.plus({days: index}).set({hour: 0, minute: 0});
      const events: ICalendarEvent[] = this.events.map((event: ICalendarEvent) => ({
        diffMinutes: DateTime.fromISO(event.endDateTime).diff(DateTime.fromISO(event.startDateTime), 'minutes').minutes,
        startTime: DateTime.fromISO(event.startDateTime).toFormat('HH:mm'),
        endTime: DateTime.fromISO(event.endDateTime).toFormat('HH:mm'),
        ...event
      })) // Clone the array
      .filter((event: ICalendarEvent): boolean => date.toISODate() === DateTime
      .fromISO(event.startDateTime).toISODate());

      weeksCalendar.push({
        day,
        fullDate: date,
        currentMonth: date.month === currentDate.month,
        currentDate: date.toISODate() === DateTime.now().toISODate(),
        events
      });
      index++;
    });
    this.weeksCalendar = weeksCalendar;
  }

  private generateTimeIntervals(): void {
    const intervals: string[] = [];
    const startInterval: number = DateTime.fromFormat(this.weekCalendarStartDay, 'HH:mm').hour || 0;
    const endInterval: number = DateTime.fromFormat(this.weekCalendarEndDay, 'HH:mm').hour || 24;
    for (let hour = startInterval; hour < endInterval; hour++) {
      for (let minute = 0; minute < 60; minute += this.intervalDuration) {
        intervals.push(DateTime.local().set({hour, minute}).toFormat('HH:mm'));
      }
    }
    this.timeIntervals = intervals;
  }

}
