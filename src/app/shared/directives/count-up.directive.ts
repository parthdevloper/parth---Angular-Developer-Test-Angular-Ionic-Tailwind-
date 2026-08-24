import { Directive, input, effect, ElementRef, DestroyRef, inject } from '@angular/core';

const DURATION = 600;

@Directive({
  selector: '[appCountUp]',
})
export class CountUpDirective {
  readonly appCountUp = input.required<number>();

  readonly countUpPrefix = input('');

  private el = inject(ElementRef);
  private frame: number | null = null;
  private current = 0;

  constructor() {
    effect(() => this.animateTo(this.appCountUp()));
    inject(DestroyRef).onDestroy(() => this.stop());
  }

  private stop() {
    if (this.frame !== null) {
      cancelAnimationFrame(this.frame);
      this.frame = null;
    }
  }

  private render(value: number) {
    this.current = value;
    this.el.nativeElement.textContent = `${this.countUpPrefix()}${value.toLocaleString()}`;
  }

  private animateTo(target: number) {
    this.stop();

    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.render(target);
      return;
    }

    const from = this.current;
    const distance = target - from;
    const startedAt = performance.now();

    const step = (now: number) => {
      const progress = Math.min((now - startedAt) / DURATION, 1);
      const eased = 1 - Math.pow(1 - progress, 4);

      this.render(Math.round(from + distance * eased));

      this.frame = progress < 1 ? requestAnimationFrame(step) : null;
    };

    this.frame = requestAnimationFrame(step);
  }
}
