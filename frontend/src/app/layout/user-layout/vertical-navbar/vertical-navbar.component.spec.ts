import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerticalNavbarComponent } from './vertical-navbar.component';
import { HttpClientModule } from '@angular/common/http';

describe('VerticalNavbarComponent', () => {
  let component: VerticalNavbarComponent;
  let fixture: ComponentFixture<VerticalNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerticalNavbarComponent, HttpClientModule],
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerticalNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
