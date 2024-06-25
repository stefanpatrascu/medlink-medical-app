import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyDoctorAppointmentsComponent } from './my-doctor-appointments.component';
import { MessageService } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

describe('DoctorAppointmentsComponent', () => {
  let component: MyDoctorAppointmentsComponent;
  let fixture: ComponentFixture<MyDoctorAppointmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MyDoctorAppointmentsComponent,
        HttpClientModule,
        RouterModule.forRoot([])
      ],
      providers: [MessageService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyDoctorAppointmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
