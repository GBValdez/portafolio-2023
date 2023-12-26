import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () =>
      import('@pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'skills',
    loadComponent: () =>
      import('@pages/skills/skills.component').then((m) => m.SkillsComponent),
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
