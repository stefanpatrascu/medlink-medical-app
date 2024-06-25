import { Component, HostListener, OnInit } from '@angular/core';
import { VerticalNavbarComponent } from '@layout/user-layout/vertical-navbar/vertical-navbar.component';
import { ActiveIconCornerComponent } from '@layout/user-layout/active-icon-corner/active-icon-corner.component';
import { ButtonModule } from 'primeng/button';
import { Router, RouterModule } from '@angular/router';
import { LogoComponent } from '@shared/components/logo/logo.component';
import { HeaderComponent } from '@layout/user-layout/header/header.component';
import { MessageService } from 'primeng/api';
import { IMessageErrorResponse } from '@interfaces/message-error-response.interface';
import { MessageErrorService } from '@services/message-error/message-error.service';

@Component({
  selector: 'app-user-layout',
  templateUrl: './user-layout.component.html',
  styleUrl: './user-layout.component.scss',
  standalone: true,
  imports: [
    HeaderComponent,
    VerticalNavbarComponent,
    ActiveIconCornerComponent,
    ButtonModule,
    LogoComponent,
    RouterModule
  ]
})
export class UserLayoutComponent implements OnInit {
  isMobile: boolean = false;
  toggleDesktopMenuState: boolean = false;
  toggleMobileMenuState: boolean = false;

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    if (event.target.innerWidth < 769) {
      this.toggleDesktopMenu(false);
    }
    this.isMobile = event.target.innerWidth < 769;
    this.toggleMobileMenuState = false;
  }

  constructor(private messageError: MessageErrorService, private messageService: MessageService, private router: Router) {
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }

  toggleDesktopMenu(state: boolean): void {
    this.toggleDesktopMenuState = state;
    localStorage.setItem('toggleDesktopMenuState', JSON.stringify(this.toggleDesktopMenuState));
  }

  toggleMobileMenu(): void {
    this.toggleMobileMenuState = !this.toggleMobileMenuState;
  }

  closeMobileMenu(): void {
    this.toggleMobileMenuState = false;
  }

  ngOnInit() {
    this.isMobile = window.innerWidth < 769;

    localStorage.getItem('toggleDesktopMenuState') === 'true' ? this.toggleDesktopMenu(true) : this.toggleDesktopMenu(false);

    this.handleErrorsOnInit();
  }

  handleErrorsOnInit() {
    this.messageError.getMessageError().subscribe((error: IMessageErrorResponse): void => {
      this.messageService.add({severity: 'error', summary: error.title, detail: error.message});
    });
  }

}
