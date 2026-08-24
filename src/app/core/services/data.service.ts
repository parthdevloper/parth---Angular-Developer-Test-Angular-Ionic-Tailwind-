import { Injectable, signal, computed } from '@angular/core';

type Card = 'left' | 'right';

const BARS: Record<Card, number[][]> = {
  left: [
    [111, 73],
    [35, 54],
    [87, 121],
  ],
  right: [
    [92, 118],
    [61, 44],
    [104, 79],
  ],
};

const SPENT_SHARE = 0.34;

@Injectable({ providedIn: 'root' })
export class DataService {
  readonly leftSliderValue = signal(1600);
  readonly rightSliderValue = signal(2100);
  readonly selectedCard = signal<Card>('left');

  readonly chartBars = computed(() => BARS[this.selectedCard()]);

  readonly analyticsData = computed(() => {
    const total = this.leftSliderValue() + this.rightSliderValue();
    const spent = Math.round(total * SPENT_SHARE);

    return {
      total,
      spent,
      breakdown: [
        { label: 'Lorem', value: Math.round(spent * 0.4) },
        { label: 'Ipsum', value: Math.round(spent * 0.35) },
        { label: 'Dolor', value: Math.round(spent * 0.25) },
      ],
    };
  });
}
