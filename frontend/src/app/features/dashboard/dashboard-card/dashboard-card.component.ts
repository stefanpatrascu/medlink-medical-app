import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgClass } from '@angular/common';
import { AppointmentStatusEnum } from '@enums/appointment-status.enum';

@Component({
  selector: 'app-dashboard-card',
  standalone: true,
  imports: [NgClass],
  templateUrl: './dashboard-card.component.html',
  styleUrl: './dashboard-card.component.scss'
})
export class DashboardCardComponent {
  @Input({required: true}) title: string | null = null;
  @Input({required: true}) count: number | null = null;
  @Input({required: true}) icon: string | null = null;
  @Input({required: true}) key: AppointmentStatusEnum | null = null;
  @Output() clicked: EventEmitter<AppointmentStatusEnum> = new EventEmitter<AppointmentStatusEnum>();

  constructor() {
  }

  navigateToAppointments() {
    if (!this.key) {
      return;
    }
    this.clicked.emit(this.key);
  }
}


