import { CanDeactivateFn } from '@angular/router';
import { HomeComponent } from '@pages/home/home.component';
import { PerfilComponent } from '@pages/perfil/perfil.component';
import { SkillsComponent } from '@pages/skills/skills.component';

export const destroyComponentGuard: CanDeactivateFn<
  HomeComponent | PerfilComponent | SkillsComponent
> = (component, currentRoute, currentState, nextState) => {
  component.destroy();
  return true;
};
