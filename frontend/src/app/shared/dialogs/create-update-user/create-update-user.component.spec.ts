import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdateUserComponent } from './create-update-user.component';
import { HttpClientModule } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

describe('CreateUpdateUserComponent', () => {
  let component: CreateUpdateUserComponent;
  let fixture: ComponentFixture<CreateUpdateUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CreateUpdateUserComponent,
        HttpClientModule
      ],
      providers: [
        MessageService,
        DynamicDialogRef,
        DynamicDialogConfig
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateUpdateUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
