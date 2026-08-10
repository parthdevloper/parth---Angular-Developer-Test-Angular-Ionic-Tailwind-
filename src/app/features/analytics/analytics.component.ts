import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { DataService } from '../../core/services/data.service';
import { CountUpDirective } from '../../shared/directives/count-up.directive';
import { TabPage } from '../../shared/tab-page.base';
import { fadeIn, tabEntry } from '../../shared/animations/route.animations';

const RING_RADIUS = 102;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;
const ARC_GAP = 5;
const TINTS = ['rgba(255, 255, 255, 0.5)', 'rgba(255, 255, 255, 0.92)'];
const PILLS: [number, number][] = [[6, 141], [147, 139], [286, 146]];

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [IonContent, CountUpDirective],
  animations: [fadeIn, tabEntry],
  templateUrl: './analytics.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './analytics.component.scss'
})
export class AnalyticsComponent extends TabPage {
  protected dataService = inject(DataService);

  readonly selectedIndex = signal(1);
  readonly dotSlots = [0, 1, 2, 3];

  readonly ringRadius = RING_RADIUS;
  readonly ringLength = RING_LENGTH;

  readonly pill = computed(() => PILLS[this.selectedIndex()] ?? PILLS[0]);

  readonly segments = computed(() => {
    const items = this.dataService.analyticsData().breakdown;
    const total = items.reduce((sum, i) => sum + i.value, 0) || 1;
    const selected = this.selectedIndex();

    let offset = 0;
    let tintIndex = 0;

    return items.map((item, i) => {
      const length = (item.value / total) * this.ringLength;
      const seg = {
        label: item.label,
        dash: Math.max(0, length - ARC_GAP),
        offset,
        paint: i === selected ? 'url(#donut-blue)' : TINTS[tintIndex++] ?? TINTS[1]
      };
      offset += length;
      return seg;
    });
  });

  readonly selected = computed(() => {
    const data = this.dataService.analyticsData();
    const item = data.breakdown[this.selectedIndex()] ?? data.breakdown[0];
    return {
      label: item.label,
      value: item.value,
      share: data.spent ? Math.round((item.value / data.spent) * 100) : 0
    };
  });

  goBack() {
    this.navigate('/home', 'back');
  }
}
