import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RescheduleAppointmentDialogComponent } from './reschedule-appointment-dialog.component';
import { MessageService } from 'primeng/api';
import { HttpClientModule } from '@angular/common/http';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

describe('RescheduleAppointmentComponent', () => {
  let component: RescheduleAppointmentDialogComponent;
  let fixture: ComponentFixture<RescheduleAppointmentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RescheduleAppointmentDialogComponent, HttpClientModule],
      providers: [MessageService, DynamicDialogRef, DynamicDialogConfig]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RescheduleAppointmentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
