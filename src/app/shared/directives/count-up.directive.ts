import { Directive, input, effect, ElementRef, inject } from '@angular/core';

@Directive({
  selector: '[appCountUp]',
  standalone: true
})
export class CountUpDirective {
  readonly appCountUp = input.required<number>();
  readonly duration = input(600);
  readonly prefix = input('$');

  private el = inject(ElementRef);
  private animFrame: number | null = null;
  private currentValue = 0;

  constructor() {
    effect(() => {
      const target = this.appCountUp();
      this.animateTo(target);
    });
  }

  private animateTo(target: number) {
    if (this.animFrame) {
      cancelAnimationFrame(this.animFrame);
    }

    const start = this.currentValue;
    const diff = target - start;
    const dur = this.duration();
    const startTime = performance.now();

    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / dur, 1);
      
      const eased = 1 - Math.pow(1 - progress, 4);
      
      this.currentValue = Math.round(start + diff * eased);
      this.el.nativeElement.textContent = `${this.prefix()}${this.currentValue.toLocaleString()}`;

      if (progress < 1) {
        this.animFrame = requestAnimationFrame(animate);
      } else {
        this.currentValue = target;
        this.el.nativeElement.textContent = `${this.prefix()}${target.toLocaleString()}`;
      }
    };

    this.animFrame = requestAnimationFrame(animate);
  }
}
