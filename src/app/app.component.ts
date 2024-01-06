import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { FaceComponent } from '@components/face/face.component';
import { SkillsComponent } from '@pages/skills/skills.component';
import { MenuComponent } from '@components/menu/menu.component';
import { MenuItem } from '@components/menu/menu.interface';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HomeComponent,
    SkillsComponent,
    MenuComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  buttons: MenuItem[] = [
    {
      text: 'Home',
      link: '/home',
      icon: 'home',
    },
    {
      text: 'Sobre mi',
      link: '/perfil',
      icon: 'face',
    },
    {
      text: 'Habilidades',
      link: '/skills',
      icon: 'star_rate',
    },
    {
      text: 'Proyectos',
      link: '/projects',
      icon: 'code',
    },
    {
      text: 'Contacto',
      link: '/contact',
      icon: 'phone',
    },
  ];
}
