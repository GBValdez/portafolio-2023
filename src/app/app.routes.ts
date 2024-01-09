import { Routes } from '@angular/router';
import { destroyComponentGuard } from '@guards/destroy-component.guard';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () =>
      import('@pages/home/home.component').then((m) => m.HomeComponent),
    canDeactivate: [destroyComponentGuard],
  },
  {
    path: 'skills',
    loadComponent: () =>
      import('@pages/skills/skills.component').then((m) => m.SkillsComponent),
    data: { dark: true },
    canDeactivate: [destroyComponentGuard],
  },
  {
    path: 'perfil',
    loadComponent: () =>
      import('@pages/perfil/perfil.component').then((m) => m.PerfilComponent),
    canDeactivate: [destroyComponentGuard],
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
