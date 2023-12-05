import { sizeThreeCanvas } from '@interfaces/screen-three.interface';
import {
  clamp,
  degreesToRadians,
  radiansToDegrees,
  randomRange,
} from '@utilsFunctions/utils';
import {
  Sprite,
  SpriteMaterial,
  Texture,
  TextureLoader,
  Vector2,
  Vector3,
} from 'three';

interface pos {
  x: number;
  y: number;
}
export class butterfly {
  material: SpriteMaterial = new SpriteMaterial({
    transparent: true,
    color: '#5162FA',
  });
  public sprite: Sprite = new Sprite(this.material);

  size: number = randomRange(0.3, 1.3);

  speed: number = 0.001;
  // Motion
  motion: number = 0;
  limit: number = randomRange(0.01, 0.06);
  // Animation
  frame: number = randomRange(0, 2);
  //Angle
  motionAngle: number = 0;
  angleSpeed: number = randomRange(0.1, 0.5);
  angleLimit: number = randomRange(1, 2);
  anglesDegrees: number = 90;
  apertura: number = randomRange(10, 45);

  get anglesRadians(): number {
    return degreesToRadians(this.anglesDegrees);
  }

  private screenSize!: sizeThreeCanvas;
  private mousePosition!: Vector3;

  constructor(
    private texture: Texture[],
    screenSize: sizeThreeCanvas,
    mousePosition: Vector3
  ) {
    this.mousePosition = mousePosition;
    this.screenSize = screenSize;
    this.sprite.scale.set(this.size, this.size, 1);
    console.log(this.anglesDegrees);
  }

  animation(): void {
    this.frame += 0.17;
    this.sprite.material.map = this.texture[Math.floor(this.frame) % 2];
  }

  updateAngle(seconds: number) {
    this.motionAngle += this.angleSpeed;
    this.motionAngle = clamp(
      this.motionAngle,
      -this.angleLimit,
      this.angleLimit
    );
    this.anglesDegrees += this.motionAngle;
    if (this.anglesDegrees > 90 + this.apertura && this.angleSpeed > 0)
      this.angleSpeed = -Math.abs(this.angleSpeed);
    if (this.anglesDegrees < 90 - this.apertura && this.angleSpeed < 0)
      this.angleSpeed = Math.abs(this.angleSpeed);
  }

  fly(): void {
    this.motion += this.speed;
    this.motion = clamp(this.motion, -this.limit, this.limit);
    if (this.sprite.position.distanceTo(this.mousePosition) > 0.01) {
      this.motion += this.speed;
      this.motion = clamp(this.motion, -this.limit, this.limit);
    }
  }

  limitScreen(): void {
    if (this.sprite.position.x > this.screenSize.width + 2) {
      this.sprite.position.x = -this.screenSize.width - 2;
    } else if (this.sprite.position.x < -this.screenSize.width - 2) {
      this.sprite.position.x = this.screenSize.width + 2;
    }
    if (this.sprite.position.y > this.screenSize.height + 2) {
      this.sprite.position.y = -this.screenSize.height - 2;
    } else if (this.sprite.position.y < -this.screenSize.height - 2) {
      this.sprite.position.y = this.screenSize.height + 2;
    }
  }

  move(): void {
    this.sprite.position.x += Math.cos(this.anglesRadians) * this.motion;
    this.sprite.position.y += Math.sin(this.anglesRadians) * this.motion;
    this.sprite.material.rotation = degreesToRadians(this.anglesDegrees - 90);
  }

  update(second: number): void {
    this.animation();

    this.fly();
    this.updateAngle(second);
    this.limitScreen();
    this.move();
  }
}
