import { CanDeactivateFn } from '@angular/router';
import { HomeComponent } from '@pages/home/home.component';
import { Mesh } from 'three';

export const homeGuard: CanDeactivateFn<HomeComponent> = (
  component,
  currentRoute,
  currentState,
  nextState
) => {
  if (component.timeOutButter) {
    clearInterval(component.timeOutButter);
  }
  cancelAnimationFrame(component.animationFrameId);
  component.butterFiles.forEach((butterfly) => {
    butterfly.dispose();
  });
  component.butterFiles = [];
  component.scene!.traverse((object) => {
    if (object instanceof Mesh) {
      if (object.material) {
        object.material.dispose();
      }
      if (object.geometry) {
        object.geometry.dispose();
      }
    }
  });
  component.scene = null;
  component.camera = null;
  component.renderer.dispose();
  return true;
};
