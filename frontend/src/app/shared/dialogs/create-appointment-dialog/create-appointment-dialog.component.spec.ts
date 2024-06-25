import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAppointmentDialogComponent } from './create-appointment-dialog.component';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { HttpClientModule } from '@angular/common/http';

describe('CreateAppointmentComponent', () => {
  let component: CreateAppointmentDialogComponent;
  let fixture: ComponentFixture<CreateAppointmentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [MessageService, DynamicDialogRef],
      imports: [ToastModule, HttpClientModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateAppointmentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
