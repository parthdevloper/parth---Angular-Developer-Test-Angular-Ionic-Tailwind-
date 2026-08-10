import { Directive, HostBinding, inject, signal, afterNextRender } from '@angular/core';
import { Router } from '@angular/router';
import { NavDirectionService } from '../core/services/nav-direction.service';

@Directive()
export abstract class TabPage {
  protected readonly router = inject(Router);
  protected readonly navDirection = inject(NavDirectionService);

  readonly loaded = signal(false);

  @HostBinding('@tabEntry') get slideIn() {
    return this.navDirection.direction();
  }

  constructor() {
    afterNextRender(() => this.loaded.set(true));
  }

  protected navigate(path: string, direction: 'forward' | 'back') {
    this.navDirection.direction.set(direction);
    this.router.navigate([path]);
  }
}
