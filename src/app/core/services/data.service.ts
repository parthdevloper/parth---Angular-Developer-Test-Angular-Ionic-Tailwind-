import { Injectable, signal, computed } from '@angular/core';

export interface AnalyticsData {
  total: number;
  spent: number;
  breakdown: { label: string; value: number }[];
}

@Injectable({ providedIn: 'root' })
export class DataService {
  readonly leftSliderValue = signal(1600);
  readonly rightSliderValue = signal(2100);

  readonly selectedCardValue = signal<number | null>(null);

  readonly chartBars = computed<number[][]>(() => {
    return this.selectedCardValue() === 2100
      ? [[92, 118], [61, 44], [104, 79]]
      : [[111, 73], [35, 54], [87, 121]];
  });

  readonly analyticsData = computed<AnalyticsData>(() => {
    const total = this.leftSliderValue() + this.rightSliderValue();
    const spent = Math.round(total * 0.34);

    return {
      total,
      spent,
      breakdown: [
        { label: 'Lorem', value: Math.round(spent * 0.4) },
        { label: 'Ipsum', value: Math.round(spent * 0.35) },
        { label: 'Dolor', value: Math.round(spent * 0.25) }
      ]
    };
  });

  setLeftSlider(val: number) {
    this.leftSliderValue.set(Math.round(val));
  }

  setRightSlider(val: number) {
    this.rightSliderValue.set(Math.round(val));
  }

  selectCard(value: number) {
    this.selectedCardValue.set(value);
  }
}
