import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/principal/principal.component').then(
        (m) => m.PrincipalComponent
      ),
  },
  {
    path: 'successful',
    loadComponent: () =>
      import('./pages/confirmation/confirmation.component').then(
        (m) => m.ConfirmationComponent
      ),
  },
];
