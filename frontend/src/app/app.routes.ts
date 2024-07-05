import { Routes } from '@angular/router';
import { RoutePathEnum } from './enums/route-path.enum';
import { UserLayoutComponent } from './layout/user-layout/user-layout.component';
import { EmployeeGuard } from './guards/employee.guard';
import { PatientGuard } from './guards/patient.guard';
import { DoctorAppointmentsCalendarComponent } from './features/appointment/doctor/doctor-appointments-calendar/doctor-appointments-calendar';
import { AuthenticatedGuard } from '@guards/authenticated.guard';
import { AdminGuard } from '@guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '',
    children: [
      {
        path: RoutePathEnum.REGISTER_PATH,
        loadComponent: () => import('./features/account/register/register.component').then(m => m.RegisterComponent),
        canActivate: [AuthenticatedGuard],
        data: {
          title: 'Register'
        }
      },
      {
        path: RoutePathEnum.LOGIN_PATH,
        loadComponent: () => import('./features/account/login/login.component').then(m => m.LoginComponent),
        canActivate: [AuthenticatedGuard],
        data: {
          title: 'Login'
        }
      },
      {
        path: RoutePathEnum.FORGOT_PASSWORD_PATH,
        loadComponent: () => import('./features/account/reset-password/reset-password.component').then(m => m.ResetPasswordComponent),
        canActivate: [AuthenticatedGuard],
        data: {
          title: 'Forgot Password'
        }
      },
      {
        path: RoutePathEnum.REDIRECTING_AFTER_LOGIN,
        canActivate: [AuthenticatedGuard],
        loadComponent: () => import('./features/not-found/not-found.component').then(m => m.NotFoundComponent),
        data: {
          title: 'Redirecting'
        }
      }
    ]
  },
  {
    path: '',
    component: UserLayoutComponent,
    children: [
      {
        path: RoutePathEnum.USERS,
        loadComponent: () => import('./features/users/users.component').then(m => m.UsersComponent),
        canActivate: [EmployeeGuard],
        data: {
          title: 'Users'
        }
      },
      {
        path: RoutePathEnum.LOGS,
        canActivate: [AdminGuard],
        data: {
          title: 'Logs'
        },
        loadComponent: () => import('./features/logs/logs.component').then(m => m.LogsComponent)
      },
      {
        path: RoutePathEnum.APPOINTMENTS,
        children: [
          {
            path: RoutePathEnum.MY_APPOINTMENTS,
            loadComponent: () => import('./features/appointment/patient/my-appointments-patient/my-appointments-patient.component').then(m => m.MyAppointmentsPatientComponent),
            canActivate: [PatientGuard],
            data: {
              title: 'My Appointments'
            }
          },
          {
            path: RoutePathEnum.DOCTOR_APPOINTMENTS,
            loadComponent: () => import('./features/appointment/doctor/my-doctor-appointments/my-doctor-appointments.component').then(m => m.MyDoctorAppointmentsComponent),
            canActivate: [EmployeeGuard],
            data: {
              title: 'Doctor Appointments'
            }
          },
          {
            path: RoutePathEnum.ALL_APPOINTMENTS,
            loadComponent: () => import('./features/appointment/doctor/all-appointments/all-appointments.component').then(m => m.AllAppointmentsComponent),
            canActivate: [EmployeeGuard],
            children: [
              {
                path: ':status',
                component: DoctorAppointmentsCalendarComponent
              }
            ],
            data: {
              title: 'All Appointments'
            }
          },
          {
            path: RoutePathEnum.MY_DOCTOR_APPOINTMENTS,
            loadComponent: () => import('./features/appointment/doctor/my-doctor-appointments/my-doctor-appointments.component').then(m => m.MyDoctorAppointmentsComponent),
            canActivate: [EmployeeGuard],
            children: [
              {
                path: ':status',
                component: DoctorAppointmentsCalendarComponent
              }
            ]
          }
        ]
      },
      {
        path: RoutePathEnum.DASHBOARD,
        canActivate: [EmployeeGuard],
        data: {
          title: 'Doctor Dashboard'
        },
        loadComponent: () => import('./features/dashboard/doctor-dashboard/doctor-dashboard.component').then(m => m.DoctorDashboardComponent)
      },
      {
        path: RoutePathEnum.FRONT_DESK_DASHBOARD,
        canActivate: [EmployeeGuard],
        data: {
          title: 'Front Desk Dashboard'
        },
        loadComponent: () => import('./features/dashboard/frontdesk-dashboard/frontdesk-dashboard.component').then(m => m.FrontdeskDashboardComponent)
      },
      {
        path: RoutePathEnum.HOME,
        canActivate: [PatientGuard],
        data: {
          title: 'Home'
        },
        loadComponent: () => import('./features/dashboard/patient-dashboard/patient-dashboard.component').then(m => m.PatientDashboardComponent)
      }
    ]
  },
  {
    path: '**',
    loadComponent: () => import('./features/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];
