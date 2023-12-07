import { NgFor, NgStyle } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { pos } from '@interfaces/screen-three.interface';

@Component({
  selector: 'app-face',
  standalone: true,
  imports: [NgFor, NgStyle],
  templateUrl: './face.component.html',
  styleUrl: './face.component.scss',
})
export class FaceComponent {
  @ViewChildren('eye') eyesRef!: QueryList<ElementRef>;
  eyes: pos[] = [
    { x: 0, y: 0 },
    { x: 0, y: 0 },
  ];

  getTransform(pos: pos): string {
    return `translate(${pos.x}px, ${pos.y}px)`;
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    this.eyesRef.forEach((eye, index) => {
      const ELEMENT = eye.nativeElement as HTMLDivElement;
      const RECT = ELEMENT.getBoundingClientRect();
      const DISTANCE = Math.sqrt(
        Math.pow(RECT.left - e.pageX, 2) + Math.pow(RECT.top - e.pageY, 2)
      );
      const FORCE: number = 6;
      this.eyes[index].x = ((e.pageX - RECT.left) / DISTANCE) * FORCE;
      this.eyes[index].y = ((e.pageY - RECT.top) / DISTANCE) * FORCE;
    });
    console.log(`Posición del ratón: X: ${e.pageX}, Y: ${e.pageY}`);
  }
}
