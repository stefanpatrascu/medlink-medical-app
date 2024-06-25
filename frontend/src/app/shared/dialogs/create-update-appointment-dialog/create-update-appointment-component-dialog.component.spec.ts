import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import {
  CreateUpdateAppointmentComponentDialogComponent
} from '@shared/dialogs/create-update-appointment-dialog/create-update-appointment-component-dialog.component';
import { HttpClientModule } from '@angular/common/http';

describe('CreateAppointmentFromCalendarDialogComponent', () => {
  let component: CreateUpdateAppointmentComponentDialogComponent;
  let fixture: ComponentFixture<CreateUpdateAppointmentComponentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [
        CreateUpdateAppointmentComponentDialogComponent,
        HttpClientModule
      ],
      providers: [
        DynamicDialogRef,
        DynamicDialogConfig,
        MessageService
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateUpdateAppointmentComponentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
