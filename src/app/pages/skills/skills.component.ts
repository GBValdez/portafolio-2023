import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import {
  Bodies,
  Body,
  Composite,
  Composites,
  Engine,
  Events,
  Mouse,
  MouseConstraint,
  Render,
  Runner,
  World,
} from 'matter-js';
import { skillLogos } from './skills';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss',
})
export class SkillsComponent implements AfterViewInit {
  skillsBodies: Body[] = [];
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.createScene();
      this.addBase();
      this.addBox();
      this.update();
    }
  }

  update(): void {
    Events.on(this.engine, 'beforeUpdate', (event) => {
      this.skillsBodies.forEach((body) => {
        if (body.position.y > window.innerHeight + 50) {
          Body.setPosition(body, { x: body.position.x, y: -50 });
        }
        if (body.position.x > window.innerWidth + 50) {
          Body.setPosition(body, { x: -50, y: body.position.y });
        }
        if (body.position.x < -50) {
          Body.setPosition(body, {
            x: window.innerWidth + 50,
            y: body.position.y,
          });
        }
      });
      // console.log(event);
    });
  }

  createScene(): void {
    this.render = Render.create({
      element: this.canvas.nativeElement,
      engine: this.engine,
      options: {
        width: this.canvas.nativeElement.clientWidth,
        height: this.canvas.nativeElement.clientHeight,
        wireframes: false,
        background: 'transparent',
      },
    });
    Runner.run(this.engine);
    Render.run(this.render);
  }

  addBase(): void {
    // const base = Bodies.rectangle(
    //   0,
    //   window.innerHeight - 10,
    //   window.innerWidth * 2,
    //   20,
    //   {
    //     isStatic: true,
    //   }
    // );
    // const baseLeft = Bodies.rectangle(0, 0, 5, window.innerHeight * 10, {
    //   isStatic: true,
    // });
    // const baseRight = Bodies.rectangle(
    //   window.innerWidth,
    //   0,
    //   5,
    //   window.innerHeight * 2,
    //   {
    //     isStatic: true,
    //   }
    // );
    // const baseTop = Bodies.rectangle(0, 0, window.innerWidth * 2, 5, {
    //   isStatic: true,
    // });
    // const baseTop = Bodies.rectangle(20, 0, window.innerWidth * 2, 5, {
    //   isStatic: true,
    // });
    let base: Body[] = [];
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        const space = y % 2 === 0 ? 0 : 75;
        base = [
          ...base,
          Bodies.circle(x * 150 + space, y * 150 + 150, 10, {
            isStatic: true,
          }),
        ];
      }
    }

    const mouse = Mouse.create(this.render.canvas);
    const MOUSE_CONSTRAINTS = MouseConstraint.create(this.engine, { mouse });
    Composite.add(this.engine.world, [
      // base,
      // baseLeft,
      // baseRight,
      // baseTop,
      MOUSE_CONSTRAINTS,
      ...base,
    ]);
  }

  addBox(): void {
    this.skillsBodies = skillLogos.map((logo, index) => {
      return Bodies.circle(100 + index * 50, 10, 50, {
        render: {
          sprite: {
            texture: `./assets/img/logos/${logo}`,
            xScale: 2.5,
            yScale: 2.5,
          },
          fillStyle: 'red',
          strokeStyle: 'blue',
        },
        mass: 12,
        restitution: 0.7,
        friction: 1,
      });
    });

    Composite.add(this.engine.world, [...this.skillsBodies]);
  }
  @ViewChild('view') canvas!: ElementRef<HTMLCanvasElement>;
  engine: Engine = Engine.create();

  render!: Render;
}
