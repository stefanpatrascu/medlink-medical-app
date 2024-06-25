import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAppointmentDialogComponent } from './view-appointment-dialog.component';
import { DialogService, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { HttpClientModule } from '@angular/common/http';

describe('ViewAppointmentAsDoctorComponent', () => {
  let component: ViewAppointmentDialogComponent;
  let fixture: ComponentFixture<ViewAppointmentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewAppointmentDialogComponent, HttpClientModule],
      providers: [DynamicDialogConfig, DialogService, MessageService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAppointmentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
