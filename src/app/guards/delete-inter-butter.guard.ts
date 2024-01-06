import { CanDeactivateFn } from '@angular/router';
import { HomeComponent } from '@pages/home/home.component';

export const deleteInterButterGuard: CanDeactivateFn<HomeComponent> = (
  component: HomeComponent,
  currentRoute,
  currentState,
  nextState
) => {
  clearTimeout(component.timeOutButter);
  return true;
};
