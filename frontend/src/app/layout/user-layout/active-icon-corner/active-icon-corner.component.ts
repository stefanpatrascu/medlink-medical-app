import { Component, input, InputSignal } from '@angular/core';

@Component({
  selector: 'app-active-icon-corner',
  standalone: true,
  imports: [],
  templateUrl: './active-icon-corner.component.html',
  styleUrl: './active-icon-corner.component.scss',
})
export class ActiveIconCornerComponent {
  hover: InputSignal<boolean> = input<boolean>(false);
  icon: InputSignal<string> = input<string>('pi pi-home');
}
