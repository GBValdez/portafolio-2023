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

  speed: number = 0.006;
  // Motion
  motion: pos = { x: 0, y: 0 };
  limitBase: number = randomRange(0.01, 0.06);
  limit: number = this.limitBase;
  // Animation
  frame: number = randomRange(0, 2);
  //Angle
  motionAngle: number = 0;
  angleSpeedBase: number = randomRange(0.1, 0.5);
  angleSpeed = this.angleSpeedBase;
  angleLimitBase: number = randomRange(1, 2);
  angleLimit: number = this.angleLimitBase;

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
    if (this.sprite.position.distanceTo(this.mousePosition) > 2) {
      this.limit = this.limitBase;
      this.angleLimit = this.angleLimitBase;

      this.motionAngle += this.angleSpeed;
      this.motionAngle = clamp(
        this.motionAngle,
        -this.angleLimit,
        this.angleLimit
      );
      this.anglesDegrees += this.motionAngle;
      if (this.anglesDegrees > 90 + this.apertura && this.angleSpeed > 0)
        this.angleSpeed = -this.angleSpeedBase;
      if (this.anglesDegrees < 90 - this.apertura && this.angleSpeed < 0)
        this.angleSpeed = this.angleSpeedBase;
    } else {
      this.limit = this.limitBase * 2.5;
      const POS: Vector3 = this.sprite.position.clone();
      POS.normalize();
      const MOUSE_POS: Vector3 = this.mousePosition.clone();
      MOUSE_POS.normalize();
      let ANGLE = Math.atan2(
        this.mousePosition.y - this.sprite.position.y,
        this.mousePosition.x - this.sprite.position.x
      );
      ANGLE = radiansToDegrees(ANGLE);
      ANGLE = (ANGLE + 360) % 360;
      ANGLE = Math.sign(Math.cos(degreesToRadians(ANGLE))) * -1;
      this.angleLimit = this.angleLimitBase * 2;
      if (ANGLE >= 0) {
        this.angleSpeed = this.angleSpeedBase * 2;
      } else {
        this.angleSpeed = -this.angleSpeedBase * 2;
      }
    }
  }

  fly(): void {
    this.motion.x += Math.cos(this.anglesRadians) * this.speed;
    this.motion.y += Math.sin(this.anglesRadians) * this.speed;
    this.motion.x = clamp(this.motion.x, -this.limit, this.limit);
    this.motion.y = clamp(this.motion.y, -this.limit, this.limit);
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
    this.sprite.position.x += this.motion.x;
    this.sprite.position.y += this.motion.y;
    this.sprite.material.rotation = degreesToRadians(this.anglesDegrees - 90);
  }

  update(second: number): void {
    this.animation();

    this.updateAngle(second);
    this.fly();

    this.limitScreen();
    this.move();
  }
}
