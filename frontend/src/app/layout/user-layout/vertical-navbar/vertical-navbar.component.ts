import { Component, effect, ElementRef, input, InputSignal, output, OutputEmitterRef, OnInit } from '@angular/core';
import { ActiveIconCornerComponent } from '../active-icon-corner/active-icon-corner.component';
import { CommonModule } from '@angular/common';
import { RolesEnum } from '../../../enums/roles.enum';
import { AccountService } from 'src/app/services/login/account.service';
import { RoutePathEnum } from '../../../enums/route-path.enum';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, Scroll } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
import { INavLink } from '@interfaces/nav-link.interface';
import { debounceTime } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';


@Component({
  selector: 'app-vertical-navbar',
  standalone: true,
  imports: [
    ActiveIconCornerComponent,
    CommonModule,
    RouterLink,
    RouterLinkActive,
    TooltipModule
  ],
  templateUrl: './vertical-navbar.component.html',
  styleUrl: './vertical-navbar.component.scss'
})
@UntilDestroy()
export class VerticalNavbarComponent implements OnInit {

  smallMenu: InputSignal<boolean> = input<boolean>(false);
  mobileMenu: InputSignal<boolean> = input<boolean>(false);
  onClick: OutputEmitterRef<void> = output<void>();

  defaultTop: string = '-15px';
  defaultIcon: string = 'pi pi-home';
  lastTop: string = '-15px';

  activeElement: HTMLElement | null = null;
  offset: number = 85;
  selectedIcon: string = 'pi pi-home';
  hover: boolean = false;
  top: string = '-15px';
  currentRoute: string = '';


  links: INavLink[] = [
    {
      label: 'Management',
      visible: this.accountService.hasAnyRoleSyn([RolesEnum.DOCTOR, RolesEnum.ADMIN, RolesEnum.FRONT_DESK]),
      type: 'heading',
      icon: 'pi pi-cog',
      children: [
        {
          label: 'Doctor Dashboard',
          routerLink: [RoutePathEnum.DASHBOARD],
          icon: 'pi pi-desktop',
          type: 'link',
          visible: this.accountService.hasAnyRoleSyn([RolesEnum.DOCTOR])
        },
        {
          label: 'Front Desk Dashboard',
          routerLink: [RoutePathEnum.FRONT_DESK_DASHBOARD],
          icon: 'pi pi-desktop',
          type: 'link',
          visible: this.accountService.hasAnyRoleSyn([RolesEnum.FRONT_DESK])
        },
        {
          label: 'All Appointments',
          routerLink: [RoutePathEnum.APPOINTMENTS, RoutePathEnum.ALL_APPOINTMENTS],
          type: 'link',
          icon: 'pi pi-calendar-plus',
          visible: this.accountService.hasAnyRoleSyn([RolesEnum.DOCTOR])
        }, {
          label: 'My Appointments',
          type: 'link',
          routerLink: [RoutePathEnum.APPOINTMENTS, RoutePathEnum.MY_DOCTOR_APPOINTMENTS],
          visible: this.accountService.hasAnyRoleSyn([RolesEnum.DOCTOR]),
          icon: 'pi pi-calendar'
        },
        {
          label: 'Users',
          routerLink: [RoutePathEnum.USERS],
          visible: this.accountService.hasAnyRoleSyn([RolesEnum.ADMIN]),
          type: 'link',
          icon: 'pi pi-users'
        },
        {
          label: 'Logs',
          routerLink: [RoutePathEnum.LOGS],
          visible: this.accountService.hasAnyRoleSyn([RolesEnum.ADMIN]),
          type: 'link',
          icon: 'pi pi-file'
        }
      ]
    },
    {
      label: 'Patient Portal',
      visible: this.accountService.hasAnyRoleSyn([RolesEnum.PATIENT]),
      type: 'heading',
      icon: 'pi pi-user',
      children: [
        {
          label: 'Home',
          routerLink: [RoutePathEnum.HOME],
          visible: this.accountService.hasAnyRoleSyn([RolesEnum.PATIENT]),
          type: 'link',
          icon: 'pi pi-home'
        },
        {
          label: 'My Appointments',
          routerLink: [RoutePathEnum.APPOINTMENTS, RoutePathEnum.MY_APPOINTMENTS],
          visible: this.accountService.hasAnyRoleSyn([RolesEnum.PATIENT]),
          type: 'link',
          icon: 'pi pi-calendar'
        }
      ]
    }
  ];

  constructor(private accountService: AccountService,
              private router: Router,
              private elem: ElementRef) {

    effect(() => {
      this.smallMenu();
      this.recalculateActiveElement();
    });
  }

  onClickLink(): void {
    this.onClick.emit();
  }

  filterLinks(): void {
    this.links = this.links
    .map((link: INavLink) => ({
      ...link,
      children: link.children?.filter(child => child.visible !== false)
    }))
    .filter(link => link.visible !== false);
  }

  ngOnInit(): void {
    this.filterLinks();

    this.currentRoute = this.router.url;

    this.router.events
    .pipe(
      debounceTime(100),
      untilDestroyed(this)
    )
    .subscribe((val) => {
      if (val instanceof NavigationEnd || val instanceof Scroll) {
        this.recalculateActiveElement();
      }
    });

  }

  recalculateActiveElement(): void {
    const childElement = this.elem.nativeElement.querySelector('.is-active .is-active');
    if (childElement) {
      this.activeElement = childElement;
    } else {
      this.activeElement = this.elem.nativeElement.querySelector('.is-active');
    }

    const icon: string | null | undefined = this.activeElement?.querySelector('i')?.getAttribute('class');
    if (icon) {
      this.selectedIcon = icon;
      this.defaultIcon = this.selectedIcon;
    }

    if (this.activeElement) {
      this.top = this.calculateOffsetByElement(this.activeElement) + 'px';
      this.defaultTop = this.top;
    }
  }

  calculateOffsetByElement(element: HTMLElement): number {
    return element.getBoundingClientRect().top + window.scrollY - this.offset;
  }

  mouseEnter(element: HTMLElement, item: INavLink): void {
    if (item.type !== 'link') {
      return;
    }

    this.top = this.calculateOffsetByElement(element) + 'px';
    this.lastTop = this.top;
    this.activeElement = element;
    this.hover = true;
    this.selectedIcon = item.icon;
  }

  mouseLeave(): void {
    this.top = this.defaultTop;
    this.hover = false;
    this.selectedIcon = this.defaultIcon;
  }
}
