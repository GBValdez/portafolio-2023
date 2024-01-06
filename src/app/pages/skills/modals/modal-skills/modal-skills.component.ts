import { Component } from '@angular/core';
import { categorySkill } from './skills';
import { NgFor } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-skills',
  standalone: true,
  imports: [NgFor, MatCardModule, MatButtonModule, MatDialogModule],
  templateUrl: './modal-skills.component.html',
  styleUrl: './modal-skills.component.scss',
})
export class ModalSkillsComponent {
  skills: categorySkill[] = [
    {
      name: 'Frontend',
      skills: [
        {
          name: 'Angular',
          img: './assets/img/logos/angular.svg',
        },

        {
          name: 'Ionic',
          img: '',
        },
        {
          name: 'HTML',
          img: './assets/img/logos/html.svg',
        },
        {
          name: 'CSS',
          img: './assets/img/logos/css.svg',
        },
        {
          name: 'Tailwind',
          img: './assets/img/logos/tailwind.svg',
        },
        {
          name: 'Javascript',
          img: './assets/img/logos/javascript.svg',
        },
        {
          name: 'Typescript',
          img: './assets/img/logos/typescript.svg',
        },
      ],
    },
    {
      name: 'Backend',
      skills: [
        {
          name: 'SpringBoot',
          img: './assets/img/logos/springboot.svg',
        },
      ],
    },
    {
      name: 'Base de datos',
      skills: [
        {
          name: 'MySQL',
          img: './assets/img/logos/mysql.svg',
        },
        {
          name: 'PostgreSQL',
          img: './assets/img/logos/postgresql.svg',
        },
      ],
    },
    {
      name: 'Otros',
      skills: [
        {
          name: 'Python',
          img: './assets/img/logos/python.svg',
        },
        {
          name: 'Git',
          img: './assets/img/logos/git.svg',
        },
        {
          name: 'GitHub',
          img: './assets/img/logos/gitHub.svg',
        },
        {
          name: 'Selenium',
          img: './assets/img/logos/selenium.svg',
        },
        {
          name: 'Figma',
          img: './assets/img/logos/figma.svg',
        },
        {
          name: 'Godot',
          img: './assets/img/logos/godot.svg',
        },
      ],
    },
  ];
}
