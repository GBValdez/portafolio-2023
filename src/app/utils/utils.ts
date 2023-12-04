export function randomRange(minValue: number, maxValue: number): number {
  return Math.random() * (maxValue - minValue) + minValue;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
