import { NgClass, NgFor, NgStyle, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Inject,
  OnInit,
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
import { skillBody, skillLogos, skillsInfo, skillsShow } from './skills';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [NgStyle, NgFor, NgClass],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss',
})
export class SkillsComponent implements AfterViewInit, OnInit {
  skillsBodies: skillBody[] = [];
  interval!: NodeJS.Timeout | null;
  boxBodies: Body[] = [];
  skillsShow: skillsShow[] = [];
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
  ngOnInit(): void {
    this.preloadImgs();
  }
  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.createScene();
      this.addBase();
      this.addBox();
      this.update();
      this.startInterval();
    }
  }

  preloadImgs(): void {
    this.skillsShow = skillLogos.map((skill) => {
      return { ...skill, show: false };
    });
    this.skillsShow[0].show = true;
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.render.canvas.width = this.canvas.nativeElement.clientWidth;
    this.render.canvas.height = this.canvas.nativeElement.clientHeight;
    this.addPoints();
  }

  startInterval(): void {
    this.interval = setInterval(() => {
      const random = Math.floor(Math.random() * (this.skillsShow.length - 1));
      this.changeLogo(random);
    }, 3000);
  }
  stopInterval(): void {
    if (this.interval) {
      clearInterval(this.interval);
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

  addPoints(): void {
    this.boxBodies.forEach((body) => {
      Composite.remove(this.engine.world, body);
    });
    this.boxBodies = [];
    let yCurrent: number = 0;
    while (yCurrent < window.innerHeight) {
      let xCurrent: number = 0;
      while (xCurrent < window.innerWidth) {
        const space = (yCurrent / 150) % 2 === 0 ? 0 : 75;
        this.boxBodies = [
          ...this.boxBodies,
          Bodies.circle(xCurrent + space, yCurrent + 150, 10, {
            isStatic: true,
          }),
        ];
        xCurrent += 150;
      }
      yCurrent += 150;
    }
    Composite.add(this.engine.world, this.boxBodies);
  }

  addBase(): void {
    this.addPoints();
    const mouse = Mouse.create(this.render.canvas);
    const MOUSE_CONSTRAINTS = MouseConstraint.create(this.engine, { mouse });
    Composite.add(this.engine.world, [MOUSE_CONSTRAINTS]);

    Events.on(MOUSE_CONSTRAINTS, 'startdrag', (event) => {
      const BODY = this.skillsBodies.find(
        (body) => body.body === event.source.body
      );
      if (!BODY) return;
      this.stopInterval();
      const INDEX: number = this.skillsShow.findIndex(
        (body) => body.logo === BODY.logo
      );
      this.changeLogo(INDEX);
    });
    Events.on(MOUSE_CONSTRAINTS, 'enddrag', (event) => {
      this.startInterval();
    });
  }

  changeLogo(index: number): void {
    const ACTIVE_SKILL = this.skillsShow.find((skill) => skill.show);
    ACTIVE_SKILL!.show = false;
    this.skillsShow[index].show = true;
  }

  createName(name: string): string {
    return name.split('.')[0].toUpperCase();
  }
  createUrl(name: string): string {
    return `./assets/img/only-logos/${name}`;
  }

  addBox(): void {
    let NUM: number = 0;
    const interval = setInterval(() => {
      const currentSkill: skillsInfo = skillLogos[NUM];
      const newBall: skillBody = {
        body: Bodies.circle(window.innerWidth * Math.random(), -100, 50, {
          render: {
            sprite: {
              texture: `./assets/img/logos/${currentSkill.logo}`,
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
        color: currentSkill.color,
        logo: currentSkill.logo,
      };
      this.skillsBodies = [...this.skillsBodies, newBall];
      Composite.add(this.engine.world, newBall.body);
      NUM++;
      if (NUM > skillLogos.length - 1) {
        clearInterval(interval);
      }
    }, 300);
  }
  @ViewChild('view') canvas!: ElementRef<HTMLCanvasElement>;
  engine: Engine = Engine.create();

  render!: Render;
}
