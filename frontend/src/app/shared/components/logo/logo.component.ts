import { ChangeDetectionStrategy, Component, input, InputSignal } from '@angular/core';

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LogoComponent {

  hideText: InputSignal<boolean> = input<boolean>(false);
  textColor: InputSignal<string> = input<string>('#333448');

}
