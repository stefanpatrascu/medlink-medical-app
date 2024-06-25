import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorDashboardComponent } from './doctor-dashboard.component';
import { AsyncPipe } from '@angular/common';
import { MessageService } from 'primeng/api';
import { DashboardCardComponent } from '../dashboard-card/dashboard-card.component';
import { HttpClientModule } from '@angular/common/http';

import { RouterModule } from '@angular/router';
describe('DoctorDashboardComponent', () => {
  let component: DoctorDashboardComponent;
  let fixture: ComponentFixture<DoctorDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DoctorDashboardComponent,
        RouterModule.forRoot([]),
        HttpClientModule,
        DashboardCardComponent,
        AsyncPipe
      ],
      providers: [MessageService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
