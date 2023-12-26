import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import {
  BufferAttribute,
  Clock,
  InstancedBufferGeometry,
  LinearFilter,
  Mesh,
  Object3D,
  OrthographicCamera,
  PerspectiveCamera,
  RGBAFormat,
  RawShaderMaterial,
  Scene,
  Texture,
  TextureLoader,
  Vector2,
  WebGLRenderer,
} from 'three';
import { VERTEX } from './glsl/vertex';
import { FRAGMENT } from './glsl/fragment';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss',
})
export class PerfilComponent implements AfterViewInit {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initThree();
      this.addTexture();
    }
  }
  private clock!: Clock;
  private camera!: PerspectiveCamera;

  private renderer!: WebGLRenderer;
  private scene!: Scene;
  private texture!: Texture;

  private container!: Object3D;
  private object!: Mesh;
  @ViewChild('canvas') private canvasRef!: ElementRef;
  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement as HTMLCanvasElement;
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
    const animate = () => {
      const DELTA = this.clock.getDelta();

      requestAnimationFrame(animate);
      this.renderer.render(this.scene, this.camera);
    };
    animate();
  }
  addTexture() {
    const loader = new TextureLoader();
    loader.load('./assets/img/sample-02.png', (texture) => {
      this.texture = texture;
      this.texture.minFilter = LinearFilter;
      this.texture.magFilter = LinearFilter;
      this.texture.format = RGBAFormat;
      this.initPoints();
    });
  }
  initPoints() {
    const numPoints: number =
      this.texture.image.width * this.texture.image.height;
    let numVisible: number = 0;
    const threshold: number = 34;
    const CANVAS_DATA: HTMLCanvasElement = document.createElement('canvas');
    const CTX = CANVAS_DATA.getContext('2d');
    CANVAS_DATA.width = this.texture.image.width;
    CANVAS_DATA.height = this.texture.image.height;
    CTX!.drawImage(
      this.texture.image,
      0,
      0,
      this.texture.image.width,
      this.texture.image.height
    );
    const IMG_DATA = CTX!.getImageData(
      0,
      0,
      CANVAS_DATA.width,
      CANVAS_DATA.height
    );
    for (let i = 0; i < numPoints * 4; i += 4) {
      if (IMG_DATA.data[i] > threshold) numVisible++;
    }

    const UNIFORMS = {
      uTime: { value: 0 },
      uRandom: { value: 1 },
      uDepth: { value: 2 },
      uSize: { value: 0 },
      uTextureSize: {
        value: new Vector2(this.texture.image.width, this.texture.image.height),
      },
      uTexture: { value: this.texture },
      UTouch: { value: null },
    };

    const MATERIAL = new RawShaderMaterial({
      uniforms: UNIFORMS,
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
      depthTest: false,
      transparent: true,
    });
    const GEOMETRY = new InstancedBufferGeometry();

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
      if (IMG_DATA.data[i * 4] > threshold) {
        OFFSETS[j * 3 + 0] = i % this.texture.image.width;
        OFFSETS[j * 3 + 1] = Math.floor(i / this.texture.image.width);
        OFFSETS[j * 3 + 2] = 0;
        ANGLES[j] = Math.random() * Math.PI;
        INDICES[j] = i;
        j++;
      }
    }
    GEOMETRY.setAttribute('pindex', new BufferAttribute(INDICES, 1, false));
    GEOMETRY.setAttribute('offset', new BufferAttribute(OFFSETS, 3, false));
    GEOMETRY.setAttribute('angle', new BufferAttribute(ANGLES, 1, false));

    this.object = new Mesh(GEOMETRY, MATERIAL);
    this.container = new Object3D();
    this.container.add(this.object);
    this.scene.add(this.container);
  }
}
