import { Component } from '@angular/core';
import { OneProjectComponent } from './components/one-project/one-project.component';
import { projectsInterface } from './projects.interface';
import { LIST_PROJECTS } from './projects';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-proyects',
  standalone: true,
  imports: [OneProjectComponent, NgStyle],
  templateUrl: './proyects.component.html',
  styleUrl: './proyects.component.scss',
})
export class ProyectsComponent {
  projects: projectsInterface[] = LIST_PROJECTS;
  destroy(): void {}
}
