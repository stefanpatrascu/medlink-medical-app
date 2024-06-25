import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyAppointmentsPatientComponent } from './my-appointments-patient.component';
import { HttpClientModule } from '@angular/common/http';

describe('MyAppointmentsComponent', () => {
  let component: MyAppointmentsPatientComponent;
  let fixture: ComponentFixture<MyAppointmentsPatientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MyAppointmentsPatientComponent,
        HttpClientModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyAppointmentsPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
