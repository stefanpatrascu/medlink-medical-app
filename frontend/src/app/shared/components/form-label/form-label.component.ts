import { Component, Input, ViewEncapsulation } from '@angular/core';
import {DropdownModule} from 'primeng/dropdown';
import { AbstractControl, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {ValidationComponent} from '../validation/validation.component';
import { NgClass } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';

@Component({
  selector: 'app-form-label',
  standalone: true,
  imports: [
    DropdownModule,
    FormsModule,
    ReactiveFormsModule,
    ValidationComponent,
    NgClass,
    InputTextModule,
    MultiSelectModule
  ],
  templateUrl: './form-label.component.html',
  styleUrl: './form-label.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class FormLabelComponent {

  @Input() controlInput!: FormControl | AbstractControl | undefined;

  @Input() styleClass: null | string = null;
  @Input() focused: boolean = false;
  @Input() iconClass: null | string = null;
  @Input() htmlFor: string = '';
  @Input() label: null | string = null;


}
