import { Component, input, output, signal, computed, ElementRef, viewChild } from '@angular/core';

@Component({
  selector: 'app-vertical-slider',
  templateUrl: './vertical-slider.component.html',
  styleUrl: './vertical-slider.component.scss',
  host: { class: 'block w-52 h-310' },
})
export class VerticalSliderComponent {
  readonly min = input(0);
  readonly max = input(2100);
  readonly step = input(100);
  readonly value = input(0);
  readonly label = input('Value');
  readonly valueChange = output<number>();

  readonly isDragging = signal(false);

  private rail = viewChild.required<ElementRef<HTMLDivElement>>('rail');

  readonly fraction = computed(() => {
    const span = this.max() - this.min();
    return span > 0 ? Math.min(1, Math.max(0, (this.value() - this.min()) / span)) : 0;
  });

  onPointerDown(e: PointerEvent) {
    e.preventDefault();
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    this.isDragging.set(true);
    this.commitFrom(e);
  }

  onPointerMove(e: PointerEvent) {
    if (this.isDragging()) this.commitFrom(e);
  }

  onKeydown(e: KeyboardEvent) {
    const up = e.key === 'ArrowUp' || e.key === 'ArrowRight';
    const down = e.key === 'ArrowDown' || e.key === 'ArrowLeft';
    if (!up && !down) return;

    e.preventDefault();
    this.commit(this.value() + (up ? this.step() : -this.step()));
  }

  private commitFrom(e: PointerEvent) {
    const rail = this.rail().nativeElement.getBoundingClientRect();
    const fromBottom = 1 - (e.clientY - rail.top) / rail.height;
    this.commit(this.min() + fromBottom * (this.max() - this.min()));
  }

  private commit(raw: number) {
    const step = this.step() || 1;
    const snapped = Math.round(raw / step) * step;
    const next = Math.min(this.max(), Math.max(this.min(), snapped));
    if (next !== this.value()) this.valueChange.emit(next);
  }
}
