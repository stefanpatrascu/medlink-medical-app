import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrontdeskDashboardComponent } from './frontdesk-dashboard.component';
import { MessageService } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

describe('FrontdeskDashboardComponent', () => {
  let component: FrontdeskDashboardComponent;
  let fixture: ComponentFixture<FrontdeskDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        HttpClientModule
      ],
      providers: [MessageService, FrontdeskDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FrontdeskDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
