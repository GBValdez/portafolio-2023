import { NgClass, NgStyle } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { projectsInterface } from '@pages/proyects/projects.interface';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CapitalizePipe } from '@pipes/capitalize.pipe';
import { BtnDirective } from '@directives/btn.directive';

@Component({
  selector: 'app-one-project',
  standalone: true,
  imports: [MatTooltipModule, CapitalizePipe, BtnDirective, NgStyle, NgClass],
  templateUrl: './one-project.component.html',
  styleUrl: './one-project.component.scss',
})
export class OneProjectComponent implements OnInit {
  @Input() project!: projectsInterface;
  styleElement: string = '';
  @Input() ultime: boolean = false;
  ngOnInit(): void {
    this.leaveHover();
  }
  openLink(url: string): void {
    window.open(url, '_blank');
  }
  enterHover(): void {
    this.styleElement = `linear-gradient(rgba(2, 0, 50, 0.7), rgba(2, 0, 50, 0.7)), url('assets/img/projects/${this.project.img}')`;
  }
  leaveHover(): void {
    this.styleElement = `linear-gradient(rgba(2, 0, 50, 0.8), rgba(2, 0, 50, 0.8)), url('assets/img/projects/${this.project.img}')`;
  }
}
