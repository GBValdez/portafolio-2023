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

  @HostListener('document:touchmove', ['$event'])
  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent | TouchEvent) {
    const x = e instanceof TouchEvent ? e.touches[0].pageX : e.pageX;
    const y = e instanceof TouchEvent ? e.touches[0].pageY : e.pageY;

    this.eyesRef.forEach((eye, index) => {
      const ELEMENT = eye.nativeElement as HTMLDivElement;
      const RECT = ELEMENT.getBoundingClientRect();
      const DISTANCE = Math.sqrt(
        Math.pow(RECT.left - x, 2) + Math.pow(RECT.top - y, 2)
      );
      const FORCE: number = 6;
      this.eyes[index].x = ((x - RECT.left) / DISTANCE) * FORCE;
      this.eyes[index].y = ((y - RECT.top) / DISTANCE) * FORCE;
    });
  }
}
