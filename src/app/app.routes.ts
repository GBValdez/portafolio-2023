import { Routes } from '@angular/router';
import { deleteInterButterGuard } from '@guards/delete-inter-butter.guard';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () =>
      import('@pages/home/home.component').then((m) => m.HomeComponent),
    canDeactivate: [deleteInterButterGuard],
  },
  {
    path: 'skills',
    loadComponent: () =>
      import('@pages/skills/skills.component').then((m) => m.SkillsComponent),
    data: { dark: true },
  },
  {
    path: 'perfil',
    loadComponent: () =>
      import('@pages/perfil/perfil.component').then((m) => m.PerfilComponent),
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
