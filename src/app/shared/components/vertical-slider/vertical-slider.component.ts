import {
  Component, input, output, signal, computed, ElementRef, viewChild, DestroyRef, inject,
  ChangeDetectionStrategy
} from '@angular/core';

@Component({
  selector: 'app-vertical-slider',
  standalone: true,
  templateUrl: './vertical-slider.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './vertical-slider.component.scss',
  host: { class: 'block w-52 h-310' }
})
export class VerticalSliderComponent {
  readonly min = input(0);
  readonly max = input(2100);
  readonly step = input(100);
  readonly value = input(0);
  readonly label = input('Value');
  readonly valueChange = output<number>();

  private rail = viewChild.required<ElementRef<HTMLDivElement>>('rail');
  private destroyRef = inject(DestroyRef);

  readonly isDragging = signal(false);

  readonly fraction = computed(() => {
    const span = this.max() - this.min();
    if (span <= 0) return 0;
    return Math.min(1, Math.max(0, (this.value() - this.min()) / span));
  });

  onPointerDown(e: PointerEvent) {
    e.preventDefault();
    this.isDragging.set(true);
    this.emitFromPointer(e);

    const onMove = (ev: PointerEvent) => this.emitFromPointer(ev);
    const onUp = () => {
      this.isDragging.set(false);
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onUp);
      document.removeEventListener('pointercancel', onUp);
    };

    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);
    document.addEventListener('pointercancel', onUp);
    this.destroyRef.onDestroy(onUp);
  }

  onKeydown(e: KeyboardEvent) {
    const delta =
      e.key === 'ArrowUp' || e.key === 'ArrowRight' ? this.step() :
      e.key === 'ArrowDown' || e.key === 'ArrowLeft' ? -this.step() : 0;
    if (!delta) return;

    e.preventDefault();
    this.commit(this.value() + delta);
  }

  private emitFromPointer(e: PointerEvent) {
    const rect = this.rail().nativeElement.getBoundingClientRect();
    const fromBottom = 1 - (e.clientY - rect.top) / rect.height;
    this.commit(this.min() + fromBottom * (this.max() - this.min()));
  }

  private commit(raw: number) {
    const step = this.step() || 1;
    const snapped = Math.round(raw / step) * step;
    const next = Math.min(this.max(), Math.max(this.min(), snapped));
    if (next !== this.value()) this.valueChange.emit(next);
  }
}
