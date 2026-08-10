import { Component, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { NavDirectionService } from '../../../core/services/nav-direction.service';

const TAB_ORDER = ['currency', 'home', 'analytics'];

@Component({
  selector: 'app-bottom-bar',
  standalone: true,
  templateUrl: './bottom-bar.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './bottom-bar.component.scss',
  host: { class: 'block desk:h-full desk:py-24 desk:pl-20' }
})
export class BottomBarComponent {
  private router = inject(Router);
  private navDirection = inject(NavDirectionService);

  private url = toSignal(
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(() => this.router.url)
    ),
    { initialValue: this.router.url }
  );

  readonly active = computed(() => TAB_ORDER.find(tab => this.url().includes(`/${tab}`)) ?? '');

  go(tab: string) {
    const current = this.active();
    if (current === tab) return;

    this.navDirection.direction.set(
      TAB_ORDER.indexOf(tab) > TAB_ORDER.indexOf(current) ? 'forward' : 'back'
    );
    this.router.navigate([`/${tab}`]);
  }
}
