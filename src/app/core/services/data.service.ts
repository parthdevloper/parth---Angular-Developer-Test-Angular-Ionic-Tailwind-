import { Injectable, signal, computed, effect, DestroyRef, inject } from '@angular/core';

export interface CurrencyData {
  code: string;
  name: string;
  rate: number;
  change: number;
  trend: 'up' | 'down';
}

export interface AnalyticsData {
  total: number;
  spent: number;
  percentage: number;
  breakdown: { label: string; value: number; color: string }[];
}

@Injectable({ providedIn: 'root' })
export class DataService {
  private destroyRef = inject(DestroyRef);
  private intervalId: ReturnType<typeof setInterval> | null = null;

  readonly leftSliderValue = signal(1600);
  readonly rightSliderValue = signal(2100);  // default

  readonly selectedCardValue = signal<number | null>(null);

  private _currencies = signal<CurrencyData[]>([
    { code: 'USD', name: 'US Dollar', rate: 1.0, change: 0.12, trend: 'up' },
    { code: 'EUR', name: 'Euro', rate: 0.92, change: -0.05, trend: 'down' },
    { code: 'GBP', name: 'British Pound', rate: 0.79, change: 0.08, trend: 'up' },
    {code: 'JPY', name: 'Japanese Yen', rate: 149.5, change: 1.2, trend: 'up'},
    { code: 'CHF', name: 'Swiss Franc', rate: 0.88, change: -0.02, trend: 'down' }
  ]);

  readonly currencies = this._currencies.asReadonly();

  readonly currencyChartData = computed(() => {
    const selected = this.selectedCardValue();
    const base = selected === 2100 
      ? [45, 62, 38, 71, 55] 
      : [32, 48, 56, 41, 67];
    return base;
  });

  readonly analyticsData = computed<AnalyticsData>(() => {
    const left = this.leftSliderValue();
    const right = this.rightSliderValue();
    const total = left + right;
    const spent = Math.round(total * 0.34);
    return {
      total,
      spent,
      percentage: 34,
      breakdown: [
        { label: 'Lorem', value: Math.round(spent * 0.4), color: '#4361ee' },
        { label: 'Ipsum', value: Math.round(spent * 0.35), color: '#7094f7' },
        { label: 'Dolor', value: Math.round(spent * 0.25), color: '#10b981' }
      ]
    };
  });

  constructor() {
    this.startRealTimeUpdates();

    this.destroyRef.onDestroy(() => {
      this.stopRealTimeUpdates();
    });
  }

  startRealTimeUpdates() {
    if (this.intervalId) return;

    // updates every 3s with random vals
    this.intervalId = setInterval(() => {
      this._currencies.update(currencies => 
        currencies.map(c => ({
          ...c,
          change: +(Math.random() * 0.4 - 0.2).toFixed(2),
          trend: Math.random() > 0.5 ? 'up' : 'down' as 'up' | 'down'
        }))
      );
    }, 3000);  // 3 second interval
  }

  stopRealTimeUpdates() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  setLeftSlider(val: number) { this.leftSliderValue.set(Math.round(val)); }

  setRightSlider(val: number) {
    this.rightSliderValue.set(Math.round(val));
  }

  selectCard(value: number) {
    this.selectedCardValue.set(value);
  }
}
