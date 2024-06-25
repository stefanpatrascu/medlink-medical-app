import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveIconCornerComponent } from './active-icon-corner.component';

describe('ActiveIconCornerComponent', () => {
  let component: ActiveIconCornerComponent;
  let fixture: ComponentFixture<ActiveIconCornerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActiveIconCornerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActiveIconCornerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
