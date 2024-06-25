import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentMenuActionsComponent } from './appointment-menu-actions.component';
import { RouterModule } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { HttpClientModule } from '@angular/common/http';

describe('AppointmentMenuActionsComponent', () => {
  let component: AppointmentMenuActionsComponent;
  let fixture: ComponentFixture<AppointmentMenuActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppointmentMenuActionsComponent,
        RouterModule,
        HttpClientModule
      ],
      providers: [DialogService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentMenuActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
