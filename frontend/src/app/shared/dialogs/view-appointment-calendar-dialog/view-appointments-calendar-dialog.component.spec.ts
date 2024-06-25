import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAppointmentsCalendarDialogComponent } from './view-appointments-calendar-dialog.component';
import { DialogService, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { HttpClientModule } from '@angular/common/http';

describe('ViewAppointmentCalendarDialogComponent', () => {
  let component: ViewAppointmentsCalendarDialogComponent;
  let fixture: ComponentFixture<ViewAppointmentsCalendarDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ViewAppointmentsCalendarDialogComponent,
        HttpClientModule
      ],
      providers: [DynamicDialogConfig, DialogService, MessageService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAppointmentsCalendarDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
