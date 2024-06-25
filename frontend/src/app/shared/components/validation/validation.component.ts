import { Component, Input } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';

@Component({
  selector: 'app-validation',
  templateUrl: './validation.component.html',
  styleUrls: ['./validation.component.scss'],
  standalone: true
})
export class ValidationComponent {
  @Input() controlInput!: FormControl | AbstractControl | undefined;
  @Input() matchingMessage: string = 'Matching error';
  @Input() patternMessage: string = 'This field contains invalid characters';

}
