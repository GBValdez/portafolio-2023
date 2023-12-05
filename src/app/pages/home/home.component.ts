import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  ElementRef,
  Inject,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { sizeThreeCanvas } from '@interfaces/screen-three.interface';
import { randomRange } from '@utilsFunctions/utils';
import { butterfly } from 'src/app/classes/butterfly';
import {
  LinearFilter,
  NearestFilter,
  OrthographicCamera,
  PerspectiveCamera,
  Scene,
  Texture,
  TextureLoader,
  Vector2,
  Vector3,
  WebGLRenderer,
  sRGBEncoding,
} from 'three';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  sizeScreen!: sizeThreeCanvas;
  time: number = 0;
  mousePosition: Vector3 = new Vector3(0, 0, 0);
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
  private butterFlies: butterfly[] = [];

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.createScene();
      this.initComponents();
      this.startRenderingLoop();
    }
  }
  @ViewChild('canvas') private canvasRef!: ElementRef;

  initComponents(): void {
    const textureLoadaer = new TextureLoader();
    const TEXTURES: Texture[] = [];
    TEXTURES.push(textureLoadaer.load('assets/img/mariposa_1.png'));
    TEXTURES.push(textureLoadaer.load('assets/img/mariposa_2.png'));
    TEXTURES.forEach((texture) => {
      texture.minFilter = NearestFilter;
      texture.magFilter = NearestFilter;
      texture.premultiplyAlpha = false;
    });
    for (let index = 0; index < 100; index++) {
      const BUTTERFLY = new butterfly(
        TEXTURES,
        this.sizeScreen,
        this.mousePosition
      );

      // Ahora puedes usar minX y maxX en randomRange
      BUTTERFLY.sprite.position.x = randomRange(
        -this.sizeScreen.width,
        this.sizeScreen.width
      );
      BUTTERFLY.sprite.position.y = -this.sizeScreen.height * Math.random() * 2;

      this.butterFlies.push(BUTTERFLY);

      this.scene.add(BUTTERFLY.sprite);
    }
  }

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  private camera!: OrthographicCamera;

  private renderer!: WebGLRenderer;
  private scene!: Scene;
  private createScene(): void {
    // scene
    this.scene = new Scene();
    // this.scene.add(this.cube);
    // camera
    const aspectRatio = this.canvas.clientWidth / this.canvas.clientHeight;
    const frustumSize = 10; // Puedes ajustar este valor según tus necesidades
    const frustumHalfHeight = frustumSize / 2;
    const frustumHalfWidth = frustumHalfHeight * aspectRatio;
    this.sizeScreen = {
      width: frustumHalfWidth,
      height: frustumHalfHeight,
    };
    this.camera = new OrthographicCamera(
      -frustumHalfWidth,
      frustumHalfWidth,
      frustumHalfHeight,
      -frustumHalfHeight,
      -1000,
      1000
    );
    this.camera.position.set(0, 0, -5);
  }

  private animateCube(): void {
    // this.cube.rotation.x += 0.01;
    // this.cube.rotation.y += 0.01;
    this.time += 0.01;
    this.butterFlies.forEach((butterfly) => {
      butterfly.update(this.time);
    });
  }
  private startRenderingLoop(): void {
    this.renderer = new WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
    });
    this.renderer.outputEncoding = sRGBEncoding;
    this.renderer.setPixelRatio;
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    const component: HomeComponent = this;
    const animate = () => {
      requestAnimationFrame(animate);
      component.animateCube();
      this.renderer.render(this.scene, this.camera);
    };
    animate();
  }

  getMousePos(evt: MouseEvent) {
    const rect = this.canvas.getBoundingClientRect(); // Obtiene la posición y tamaño del canvas
    this.mousePosition.set(evt.clientX - rect.left, evt.clientY - rect.top, 0);
  }
}
