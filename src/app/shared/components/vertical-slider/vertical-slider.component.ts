import { Component, input, output, signal, computed, ElementRef, viewChild, AfterViewInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-vertical-slider',
  standalone: true,
  templateUrl: './vertical-slider.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './vertical-slider.component.scss'
})
export class VerticalSliderComponent implements AfterViewInit {
  readonly min = input(0);
  readonly max = input(5000);
  readonly value = input(1000);
  readonly step = input(500);
  readonly valueChange = output<number>();

  private container = viewChild.required<ElementRef<HTMLDivElement>>('container');
  readonly isDragging = signal(false);
  private currentValue = signal(1000);

  readonly fillPercent = signal(0);
  readonly thumbPosition = signal(0);
  
  readonly labels = computed(() => {
    const result: string[] = [];
    const stepVal = this.step();
    for (let i = this.min(); i <= this.max(); i += stepVal) {
      result.push(i.toString());
    }
    return result;
  });

  ngAfterViewInit() {
    this.currentValue.set(this.value());
    this.updatePosition();
  }

  private updatePosition() {
    const pct = ((this.currentValue() - this.min()) / (this.max() - this.min())) * 100;
    this.fillPercent.set(pct);
    this.thumbPosition.set(pct);
  }

  onPointerDown(e: PointerEvent) {
    e.preventDefault();
    this.isDragging.set(true);
    
    const el = this.container().nativeElement;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    const onMove = (ev: PointerEvent) => {
      if (!this.isDragging()) return;
      
      const rect = el.getBoundingClientRect();
      const y = ev.clientY - rect.top;
      const pct = 1 - Math.max(0, Math.min(1, y / rect.height));
      const val = this.min() + pct * (this.max() - this.min());
      
      this.currentValue.set(Math.round(val));
      this.updatePosition();
      this.valueChange.emit(this.currentValue());
    };

    const onUp = () => {
      this.isDragging.set(false);
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onUp);
    };

    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);
  }
}
