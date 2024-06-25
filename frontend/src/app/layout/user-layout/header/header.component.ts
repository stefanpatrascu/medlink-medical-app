import { Component, input, InputSignal, OnInit, output, OutputEmitterRef } from '@angular/core';
import { take } from 'rxjs';
import { AccountService } from 'src/app/services/login/account.service';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { IMyAccount } from '@interfaces/account/my-account.interface';
import { RoutePathEnum } from '@enums/route-path.enum';

@Component({
  imports: [
    MenubarModule,
    ButtonModule
  ],
  selector: 'app-header',
  standalone: true,
  styleUrl: './header.component.scss',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {
  toggleState: InputSignal<boolean> = input<boolean>(false);
  onToggle: OutputEmitterRef<boolean> = output<boolean>();

  items: MenuItem[] | undefined;
  accountItems: MenuItem[] | undefined;
  myAccount: IMyAccount | null = null;

  constructor(private accountService: AccountService,
              private router: Router) {
  }

  ngOnInit() {
    this.populateMyAccount();
  }

  toggleMenu(): void {
    this.onToggle.emit(!this.toggleState());
  }

  populateAccountMenu(): void {
    this.accountItems = [
      {
        label: this.myAccount?.fullName,
        items: [
          {
            label: 'Log out',
            command: () => this.logout()
          }
        ]
      }
    ];
  }

  logout(): void {
    this.accountService.logout().pipe(
      take(1)
    ).subscribe(() => {
      this.router.navigate([RoutePathEnum.LOGIN_PATH]);
    });
  }

  populateMyAccount(): void {
    this.accountService.myAccount()
    .pipe(
      take(1)
    ).subscribe((response: IMyAccount) => {
      this.myAccount = response;
      this.populateAccountMenu();
    });
  }


}
