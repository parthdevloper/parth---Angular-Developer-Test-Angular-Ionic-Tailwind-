import { Component, inject, signal, computed } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { DataService } from '../../core/services/data.service';
import { CountUpDirective } from '../../shared/directives/count-up.directive';
import { TabPage } from '../../shared/tab-page.base';
import { fadeIn, tabEntry } from '../../shared/animations/route.animations';

const RING_RADIUS = 102;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;

const ARC_GAP = 5;

const TINTS = ['rgba(255, 255, 255, 0.5)', 'rgba(255, 255, 255, 0.92)'];
const TAB_WIDTHS = [147, 139, 152];
const PILL_INSET = 6;

@Component({
  selector: 'app-analytics',
  imports: [IonContent, CountUpDirective],
  animations: [fadeIn, tabEntry],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.scss',
})
export class AnalyticsComponent extends TabPage {
  protected dataService = inject(DataService);

  private requestedIndex = signal(1);

  readonly segments = computed(() => {
    const items = this.dataService.analyticsData().breakdown;
    const total = items.reduce((sum, i) => sum + i.value, 0) || 1;
    const selected = this.selectedIndex();

    let offset = 0;
    let tint = 0;

    return items.map((item, i) => {
      const length = (item.value / total) * this.ringLength;
      const seg = {
        label: item.label,
        dash: Math.max(0, length - ARC_GAP),
        offset,
        paint: i === selected ? 'url(#donut-blue)' : (TINTS[tint++] ?? TINTS[1]),
      };
      offset += length;
      return seg;
    });
  });

  readonly selectedIndex = computed(() => {
    const count = this.dataService.analyticsData().breakdown.length;
    return Math.min(this.requestedIndex(), Math.max(0, count - 1));
  });

  readonly ringRadius = RING_RADIUS;
  readonly ringLength = RING_LENGTH;

  readonly highlight = computed(() => this.pillGeometry(this.selectedIndex()));

  readonly selected = computed(() => {
    const data = this.dataService.analyticsData();
    const item = data.breakdown[this.selectedIndex()] ?? data.breakdown[0];
    return {
      label: item.label,
      value: item.value,
      share: data.spent ? Math.round((item.value / data.spent) * 100) : 0,
    };
  });

  select(index: number) {
    this.requestedIndex.set(index);
  }

  tabWidth(index: number) {
    return TAB_WIDTHS[index] ?? 0;
  }

  private pillGeometry(index: number) {
    const start = TAB_WIDTHS.slice(0, index).reduce((sum, w) => sum + w, 0);
    const isFirst = index === 0;
    const isLast = index === TAB_WIDTHS.length - 1;

    return {
      x: start + (isFirst ? PILL_INSET : 0),
      w: this.tabWidth(index) - (isFirst ? PILL_INSET : 0) - (isLast ? PILL_INSET : 0),
    };
  }

  goBack() {
    this.navigate('/home', 'back');
  }
}
