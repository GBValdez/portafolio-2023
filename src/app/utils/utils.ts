export function randomRange(minValue: number, maxValue: number): number {
  return Math.random() * (maxValue - minValue) + minValue;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
export function radiansToDegrees(radians: number): number {
  return radians * (180 / Math.PI);
}

export function degreesToRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

export const easeOutSine = (t: number, b: number, c: number, d: number) => {
  return c * Math.sin((t / d) * (Math.PI / 2)) + b;
};
