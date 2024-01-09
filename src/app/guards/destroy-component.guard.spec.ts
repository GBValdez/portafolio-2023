import { TestBed } from '@angular/core/testing';
import { CanDeactivateFn } from '@angular/router';

import { destroyComponentGuard } from './destroy-component.guard';

describe('destroyComponentGuard', () => {
  const executeGuard: CanDeactivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => destroyComponentGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
