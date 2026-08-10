import { Directive, input, effect, ElementRef, inject } from '@angular/core';

const DURATION = 600;
const PREFIX = '$';

@Directive({
  selector: '[appCountUp]',
  standalone: true
})
export class CountUpDirective {
  readonly appCountUp = input.required<number>();

  private el = inject(ElementRef);
  private animFrame: number | null = null;
  private currentValue = 0;

  constructor() {
    effect(() => this.animateTo(this.appCountUp()));
  }

  private animateTo(target: number) {
    if (this.animFrame) {
      cancelAnimationFrame(this.animFrame);
    }

    const start = this.currentValue;
    const diff = target - start;
    const startTime = performance.now();

    const animate = (time: number) => {
      const progress = Math.min((time - startTime) / DURATION, 1);
      const eased = 1 - Math.pow(1 - progress, 4);

      this.currentValue = Math.round(start + diff * eased);
      this.paint(this.currentValue);

      if (progress < 1) {
        this.animFrame = requestAnimationFrame(animate);
      } else {
        this.currentValue = target;
        this.paint(target);
      }
    };

    this.animFrame = requestAnimationFrame(animate);
  }

  private paint(value: number) {
    this.el.nativeElement.textContent = `${PREFIX}${value.toLocaleString()}`;
  }
}
