import { NgClass, NgFor, NgStyle, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Inject,
  OnDestroy,
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
import { ModalSkillsComponent } from './modals/modal-skills/modal-skills.component';
import { MatDialog } from '@angular/material/dialog';
import { BtnDirective } from 'src/app/directives/btn.directive';
@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [NgStyle, NgFor, NgClass, ModalSkillsComponent, BtnDirective],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss',
})
export class SkillsComponent implements AfterViewInit, OnInit, OnDestroy {
  skillsBodies: skillBody[] = [];
  interval!: NodeJS.Timeout | null;
  boxBodies: Body[] = [];
  skillsShow: skillsShow[] = [];
  runner: Runner | null = null;
  mouseConstraint: MouseConstraint | null = null;
  boxInterval!: NodeJS.Timeout;
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private dialog: MatDialog
  ) {}
  ngOnDestroy(): void {
    this.stopInterval();
    if (this.interval) clearInterval(this.interval);
    if (this.boxInterval) clearInterval(this.boxInterval);
    Runner.stop(this.runner!);
    Render.stop(this.render!);
    if (this.render!.canvas) this.render!.canvas.remove();
    this.render!.textures = {};
    Events.off(this.engine, 'beforeUpdate', this.updateFixed);
    Events.off(this.mouseConstraint, 'startdrag', this.startDragMouse);
    Events.off(MouseConstraint, 'enddrag', this.endDragMouse);
    World.remove(this.engine!.world, this.mouseConstraint!);
    World.clear(this.engine!.world, false);
    Engine.clear(this.engine!);
    this.engine = null;
    this.render = null;
    this.runner = null;
    this.mouseConstraint = null;
  }
  ngOnInit(): void {
    this.preloadImgs();
  }
  openList(): void {
    this.dialog.open(ModalSkillsComponent, { width: '60%', minWidth: '300px' });
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
    this.render!.canvas.width = this.canvas.nativeElement.clientWidth;
    this.render!.canvas.height = this.canvas.nativeElement.clientHeight;
    console.log('width ' + this.render!.canvas.width);
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

  updateFixed = () => {
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
  };

  update(): void {
    Events.on(this.engine, 'beforeUpdate', this.updateFixed);
  }

  createScene(): void {
    this.render = Render.create({
      element: this.canvas.nativeElement,
      engine: this.engine!,
      options: {
        width: this.canvas.nativeElement.clientWidth,
        height: this.canvas.nativeElement.clientHeight,
        wireframes: false,
        background: 'transparent',
      },
    });
    this.runner = Runner.run(this.engine!);
    Render.run(this.render);
  }

  addPoints(): void {
    this.boxBodies.forEach((body) => {
      Composite.remove(this.engine!.world, body);
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
            render: {
              fillStyle: '#000229',
              strokeStyle: '#000229',
            },
          }),
        ];
        xCurrent += 150;
      }
      yCurrent += 150;
    }
    Composite.add(this.engine!.world, this.boxBodies);
  }

  startDragMouse = (event: any) => {
    const BODY = this.skillsBodies.find(
      (body) => body.body === event.source.body
    );
    if (!BODY) return;
    this.stopInterval();
    const INDEX: number = this.skillsShow.findIndex(
      (body) => body.logo === BODY.logo
    );
    this.changeLogo(INDEX);
  };
  endDragMouse = (event: any) => {
    this.startInterval();
  };

  addBase(): void {
    this.addPoints();
    const mouse = Mouse.create(this.render!.canvas);
    this.mouseConstraint = MouseConstraint.create(this.engine!, { mouse });
    Composite.add(this.engine!.world, [this.mouseConstraint]);

    Events.on(this.mouseConstraint, 'startdrag', this.startDragMouse);
    Events.on(MouseConstraint, 'enddrag', this.endDragMouse);
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
    this.boxInterval = setInterval(() => {
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
      Composite.add(this.engine!.world, newBall.body);
      NUM++;
      if (NUM > skillLogos.length - 1) {
        clearInterval(this.boxInterval);
      }
    }, 300);
  }
  @ViewChild('view') canvas!: ElementRef<HTMLCanvasElement>;
  engine: Engine | null = Engine.create();

  render: Render | null = null;
}
