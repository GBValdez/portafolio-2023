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

export class butterfly {
  material!: SpriteMaterial;
  scaleSpeed!: number;
  speed!: number;
  size!: number;
  xSpeed!: number;
  public sprite!: Sprite;
  private screenSize!: sizeThreeCanvas;
  constructor(
    private texture: Texture[],
    screenSize: sizeThreeCanvas,
    private mousePosition: Vector3
  ) {
    this.screenSize = screenSize;
    console.log(screenSize);
    this.material = new SpriteMaterial({ map: this.texture[0] });
    this.sprite = new Sprite(this.material);
    this.size = randomRange(0.5, 1.5);
    this.scaleSpeed = randomRange(0.05, 0.03);
    this.sprite.scale.set(this.size, this.size, 1);
    this.speed = randomRange(0.01, 0.05);
    this.xSpeed = randomRange(0.3, 1);
    this.xSpeed *= Math.random() > 0.5 ? 1 : -1;
  }

  scale(): void {
    this.sprite.scale.x += this.scaleSpeed;
    this.sprite.scale.x = clamp(
      this.sprite.scale.x,
      this.size * 0.1,
      this.size
    );

    if (
      this.sprite.scale.x == this.size ||
      this.sprite.scale.x == this.size * 0.1
    ) {
      this.scaleSpeed *= -1;
    }
  }
  fly(second: number): void {
    const currentPosition: Vector3 = this.sprite.position.clone();
    this.sprite.position.y += this.speed;
    if (this.sprite.position.y > this.screenSize.height + 0.5) {
      this.sprite.position.y = -this.screenSize.height - 0.5;
    }
    // console.log(this.mousePosition);
    if (this.mousePosition)
      if (this.sprite.position.distanceTo(this.mousePosition) > 1.5)
        this.sprite.position.x += Math.sin(second) / (300 * this.xSpeed);
      else {
        console.log('uir');
        const DIRECTION_X = Math.sign(
          this.mousePosition.x - this.sprite.position.x
        );
        this.sprite.position.x += DIRECTION_X * 0.1;
      }
    else this.sprite.position.x += Math.sin(second) / (300 * this.xSpeed);
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
    this.scale();
    this.fly(second);
  }
}
