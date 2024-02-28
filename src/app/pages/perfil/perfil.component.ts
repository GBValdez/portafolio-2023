import { isPlatformBrowser } from '@angular/common';
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
  BufferAttribute,
  CircleGeometry,
  Clock,
  InstancedBufferAttribute,
  InstancedBufferGeometry,
  LinearFilter,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  OrthographicCamera,
  PerspectiveCamera,
  PlaneGeometry,
  RGBAFormat,
  RawShaderMaterial,
  Raycaster,
  Scene,
  Texture,
  TextureLoader,
  Vector2,
  WebGLRenderer,
} from 'three';
import { VERTEX } from './glsl/vertex';
import { FRAGMENT } from './glsl/fragment';
import { TouchTexture } from '@myClass/touchTexture';
import { pos } from '@interfaces/screen-three.interface';
import gsap from 'gsap';
import { BtnDirective } from 'src/app/directives/btn.directive';
import { MatDialog } from '@angular/material/dialog';
import { ContactComponent } from './modals/contact/contact.component';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [BtnDirective],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss',
})
export class PerfilComponent implements AfterViewInit {
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private dialog: MatDialog
  ) {}
  destroy(): void {
    if (this.animationId) cancelAnimationFrame(this.animationId);
    if (this.scene)
      this.scene.traverse((object) => {
        if (object instanceof Mesh) {
          if (object.material) {
            object.material.dispose();
          }
          if (object.geometry) {
            object.geometry.dispose();
          }
        }
      });
    // Limpiar objetos, materiales y texturas específicos
    if (this.object) {
      this.object.geometry.dispose();
      const MATERIAL = this.object.material as RawShaderMaterial;
      MATERIAL.dispose();
    }
    if (this.texture) this.texture.dispose();

    // Limpiar y eliminar la cámara y la escena
    this.scene = null;
    this.camera = null;

    // Limpiar el renderizador
    this.renderer.dispose();
  }
  @HostListener('window:resize', ['$event']) onResize(event: any) {
    this.resize();
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initThree();
      this.container = new Object3D();
      this.scene!.add(this.container);
      this.addTexture();
    }
  }
  private clock!: Clock;
  private camera: PerspectiveCamera | null = null;
  private fovHeight: number = 0;
  private renderer!: WebGLRenderer;
  private scene: Scene | null = null;
  private texture!: Texture;
  private rect!: DOMRect;

  private container!: Object3D;
  private object!: Mesh;
  private raysCaster: Raycaster = new Raycaster();
  private planeHit!: Mesh;
  private animationId!: number;

  touchTexture!: TouchTexture;
  @ViewChild('canvas') private canvasRef!: ElementRef;
  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement as HTMLCanvasElement;
  }

  initPart() {
    const MATERIAL = this.object.material as RawShaderMaterial;
    const TIME = 0.7;
    gsap
      .fromTo(
        MATERIAL.uniforms['uSize'],
        { value: 0.0 },
        {
          value: 2,
          duration: TIME,
          ease: 'power1.out',
        }
      )
      .play();
    gsap
      .to(MATERIAL.uniforms['uRandom'], {
        value: 2.0,
        duration: TIME,
        ease: 'power1.out',
      })
      .play();

    gsap
      .fromTo(
        MATERIAL.uniforms['uDepth'],
        { value: 40.0 },
        { value: 4.0, duration: TIME * 1.5, ease: 'power1.out' }
      )
      .play();
  }

  initThree() {
    this.scene = new Scene();

    this.camera = new PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      1,
      10000
    );
    this.camera.position.z = 300;
    this.renderer = new WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
    });
    this.clock = new Clock(true);
  }

  animate() {
    const DELTA = this.clock.getDelta();
    const MATERIAL = this.object.material as RawShaderMaterial;
    this.touchTexture.update();
    MATERIAL.uniforms['uTime'].value += DELTA;
    this.renderer.render(this.scene!, this.camera!);
    this.animationId = requestAnimationFrame(this.animate.bind(this));
  }

  addTexture() {
    const loader = new TextureLoader();
    loader.load('./assets/img/StartGB.png', (texture) => {
      this.texture = texture;
      this.texture.minFilter = LinearFilter;
      this.texture.magFilter = LinearFilter;
      this.texture.format = RGBAFormat;
      this.initPoints();
      this.resize();
      this.initTouch();
      this.createHitArea();
      this.animate();
      this.initPart();
    });
  }

  initPoints() {
    const numPoints: number =
      this.texture.image.width * this.texture.image.height;
    let numVisible: number = 0;
    const threshold: number = 34;
    const CANVAS_ELEMENT: HTMLCanvasElement = document.createElement('canvas');
    const CTX = CANVAS_ELEMENT.getContext('2d');

    CANVAS_ELEMENT.width = this.texture.image.width;
    CANVAS_ELEMENT.height = this.texture.image.height;
    CTX!.scale(1, -1);
    CTX!.drawImage(
      this.texture.image,
      0,
      0,
      this.texture.image.width,
      this.texture.image.height * -1
    );

    const IMG_DATA = CTX!.getImageData(
      0,
      0,
      CANVAS_ELEMENT.width,
      CANVAS_ELEMENT.height
    );
    const ORIGINAL_COLORS = Float32Array.from(IMG_DATA.data);

    for (let i = 0; i < numPoints; i++) {
      const prom =
        ORIGINAL_COLORS[i * 4 + 0] +
        ORIGINAL_COLORS[i * 4 + 1] +
        ORIGINAL_COLORS[i * 4 + 2] / 3;
      if (prom > threshold) numVisible++;
    }

    const UNIFORMS = {
      uTime: { value: 0 },
      uRandom: { value: 2.0 },
      uDepth: { value: 4.0 },
      uSize: { value: 2 },
      uTextureSize: {
        value: new Vector2(this.texture.image.width, this.texture.image.height),
      },
      uTexture: { value: this.texture },
      uTouch: { value: null },
    };

    const MATERIAL: RawShaderMaterial = new RawShaderMaterial({
      uniforms: UNIFORMS,
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
      depthTest: false,
      transparent: true,
    });

    const GEOMETRY: InstancedBufferGeometry = new InstancedBufferGeometry();

    const POSITIONS = new BufferAttribute(new Float32Array(4 * 3), 3);
    POSITIONS.setXYZ(0, -0.5, 0.5, 0.0);
    POSITIONS.setXYZ(1, 0.5, 0.5, 0.0);
    POSITIONS.setXYZ(2, -0.5, -0.5, 0.0);
    POSITIONS.setXYZ(3, 0.5, -0.5, 0.0);
    GEOMETRY.setAttribute('position', POSITIONS);

    const UVS = new BufferAttribute(new Float32Array(4 * 2), 2);
    UVS.setXY(0, 0.0, 0.0);
    UVS.setXY(1, 1.0, 0.0);
    UVS.setXY(2, 0.0, 1.0);
    UVS.setXY(3, 1.0, 1.0);
    GEOMETRY.setAttribute('uv', UVS);

    GEOMETRY.setIndex(
      new BufferAttribute(new Uint16Array([0, 2, 1, 2, 3, 1]), 1)
    );

    const INDICES = new Uint16Array(numVisible);
    const OFFSETS = new Float32Array(numVisible * 3);
    const ANGLES = new Float32Array(numVisible);

    for (let i = 0, j = 0; i < numPoints; i++) {
      const prom =
        ORIGINAL_COLORS[i * 4 + 0] +
        ORIGINAL_COLORS[i * 4 + 1] +
        ORIGINAL_COLORS[i * 4 + 2] / 3;
      if (prom <= threshold) continue;

      OFFSETS[j * 3 + 0] = i % this.texture.image.width;
      OFFSETS[j * 3 + 1] = Math.floor(i / this.texture.image.width);

      INDICES[j] = i;

      ANGLES[j] = Math.random() * Math.PI;

      j++;
    }

    GEOMETRY.setAttribute(
      'pindex',
      new InstancedBufferAttribute(INDICES, 1, false)
    );
    GEOMETRY.setAttribute(
      'offset',
      new InstancedBufferAttribute(OFFSETS, 3, false)
    );
    GEOMETRY.setAttribute(
      'angle',
      new InstancedBufferAttribute(ANGLES, 1, false)
    );

    this.object = new Mesh(GEOMETRY, MATERIAL);
    this.container.add(this.object);
  }

  resize() {
    if (!this.renderer) return;
    this.camera!.aspect = window.innerWidth / window.innerHeight;
    this.camera!.updateProjectionMatrix();

    this.fovHeight =
      2 *
      Math.tan((this.camera!.fov * Math.PI) / 180 / 2) *
      this.camera!.position.z;

    this.renderer.setSize(window.innerWidth, window.innerHeight);

    const scale = this.fovHeight / this.texture.image.height;
    this.object.scale.set(scale, scale, 1);
    this.rect = this.canvas.getBoundingClientRect();
  }
  initTouch() {
    this.touchTexture = new TouchTexture();
    const MATERIAL = this.object.material as RawShaderMaterial;
    MATERIAL.uniforms['uTouch'].value = this.touchTexture.texture;
  }

  createHitArea() {
    const GEOMETRY = new PlaneGeometry(
      this.texture.image.width,
      this.texture.image.height,
      1,
      1
    );
    const MATERIAL = new MeshBasicMaterial({ color: 0xffffff });
    MATERIAL.visible = false;
    this.planeHit = new Mesh(GEOMETRY, MATERIAL);
    this.container.add(this.planeHit);
  }

  moveTouch(e: TouchEvent | MouseEvent) {
    let posPoint: pos[] = [];
    const addPOints = (x: number, y: number) => {
      const point: Vector2 = new Vector2(x, y);
      point.x = ((point.x + this.rect.x) / this.rect.width) * 2 - 1;
      point.y = -((point.y + this.rect.y) / this.rect.height) * 2 + 1;
      this.raysCaster.setFromCamera(point, this.camera!);
      const intersects = this.raysCaster.intersectObject(this.planeHit);
      if (intersects.length > 0) {
        const objectIntersect = intersects[0];
        posPoint.push({
          x: objectIntersect.uv!.x,
          y: objectIntersect.uv!.y,
        });
      }
    };
    if (e instanceof TouchEvent) {
      for (let index = 0; index < e.touches.length; index++) {
        const touch = e.touches[index];
        addPOints(touch.clientX, touch.clientY);
      }
    }
    if (e instanceof MouseEvent) {
      addPOints(e.clientX, e.clientY);
    }
    this.touchTexture.addTouch(posPoint);
  }

  showCV(): void {
    window.open(
      'https://drive.google.com/file/d/1vrgym4nMj_oLCi7oecT9TlKVeESb57NE/view?usp=sharing',
      '_blank'
    );
  }

  viewContact(): void {
    this.dialog.open(ContactComponent, {
      width: '50%',
      minWidth: '270px',
    });
  }
}
