import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DoctorAppointmentsTableComponent } from './doctor-appointments-table.component';
import { DialogService } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

describe('DoctorAppointmentsSwitcherComponentView', () => {
  let component: DoctorAppointmentsTableComponent;
  let fixture: ComponentFixture<DoctorAppointmentsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [
        DoctorAppointmentsTableComponent,
        RouterModule.forRoot([]),
        HttpClientModule
      ],
      providers: [DialogService, MessageService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorAppointmentsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
