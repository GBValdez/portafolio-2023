import { sizeThreeCanvas } from '@interfaces/screen-three.interface';
import { clamp, randomRange } from '@utilsFunctions/utils';
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
  material!: SpriteMaterial;
  size!: number;

  speed: pos = { x: 0, y: 0 };
  // Motion
  motion: pos = { x: 0, y: 0 };
  limit: pos = { x: 0, y: 0 };
  // Animation
  frame: number = 0;
  public sprite!: Sprite;
  private screenSize!: sizeThreeCanvas;
  private mousePosition!: Vector3;
  constructor(
    private texture: Texture[],
    screenSize: sizeThreeCanvas,
    mousePosition: Vector3
  ) {
    this.mousePosition = mousePosition;
    this.screenSize = screenSize;
    this.material = new SpriteMaterial({
      transparent: true,
      color: '#5162FA',
    });
    this.sprite = new Sprite(this.material);
    this.size = randomRange(0.3, 1.2);
    this.sprite.scale.set(this.size, this.size, 1);
    this.speed.y = randomRange(0.01, 0.06);
    this.frame = randomRange(0, 2);

    this.speed.x = randomRange(0.3, 1);
    this.speed.x *= Math.random() > 0.5 ? 1 : -1;
  }

  animation(): void {
    this.frame += 0.17;
    this.sprite.material.map = this.texture[Math.floor(this.frame) % 2];
  }
  fly(second: number): void {
    const currentPosition: Vector3 = this.sprite.position.clone();
    this.sprite.position.y += this.speed;
    if (this.sprite.position.y > this.screenSize.height + 0.5) {
      this.sprite.position.y = -this.screenSize.height - 0.5;
    }
    if (this.mousePosition) {
      if (this.sprite.position.distanceTo(this.mousePosition) > 3)
        this.sprite.position.x += Math.sin(second) / (300 * this.xSpeed);
      else {
        const DIRECTION_X = Math.sign(
          this.mousePosition.x - this.sprite.position.x
        );
        this.sprite.position.x -= (DIRECTION_X * Math.abs(this.xSpeed)) / 100;
      }
    } else this.sprite.position.x += Math.sin(second) / (300 * this.xSpeed);
    this.updateSpriteRotation(this.sprite, currentPosition);
  }

  updateSpriteRotation(sprite: Sprite, initPosition: Vector3) {
    // Calcular el vector de dirección
    var direction = new Vector3();
    direction.subVectors(sprite.position, initPosition).normalize();

    // Calcular el ángulo de rotación
    var angle = Math.atan2(direction.y, direction.x) - 1.571;

    // Aplicar la rotación
    // Ajusta este código según el eje sobre el que necesitas rotar
    sprite.material.rotation = angle;
  }

  update(second: number): void {
    this.animation();
    this.fly(second);
  }
}
