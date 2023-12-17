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
import { skillBody, skillLogos } from './skills';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss',
})
export class SkillsComponent implements AfterViewInit {
  skillsBodies: skillBody[] = [];
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
        if (body.body.position.y > window.innerHeight + 50) {
          Body.setPosition(body.body, { x: body.body.position.x, y: -50 });
        }
        if (body.body.position.x > window.innerWidth + 50) {
          Body.setPosition(body.body, { x: -50, y: body.body.position.y });
        }
        if (body.body.position.x < -50) {
          Body.setPosition(body.body, {
            x: window.innerWidth + 50,
            y: body.body.position.y,
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
    Composite.add(this.engine.world, [MOUSE_CONSTRAINTS, ...base]);
  }

  addBox(): void {
    this.skillsBodies = skillLogos.map((logo, index) => {
      return {
        body: Bodies.circle(100 + index * 50, 10, 50, {
          render: {
            sprite: {
              texture: `./assets/img/logos/${logo.logo}`,
              xScale: 2.5,
              yScale: 2.5,
            },
            fillStyle: 'red',
            strokeStyle: 'blue',
          },
          mass: 12,
          restitution: 0.7,
          friction: 1,
        }),
        color: logo.color,
        logo: logo.logo,
      };
    });

    Composite.add(this.engine.world, [...this.skillsBodies.map((b) => b.body)]);
  }
  @ViewChild('view') canvas!: ElementRef<HTMLCanvasElement>;
  engine: Engine = Engine.create();

  render!: Render;
}
