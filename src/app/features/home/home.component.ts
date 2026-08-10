import { Component, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { IonContent } from '@ionic/angular/standalone';
import { DataService } from '../../core/services/data.service';
import { TabPage } from '../../shared/tab-page.base';
import { fadeIn, tabEntry } from '../../shared/animations/route.animations';

interface RateCell {
  value: number;
  change: number;
  trend: 'up' | 'down';
}

interface RateRow {
  code: string;
  cells: RateCell[];
}

const ROWS: RateRow[] = [
  {
    code: 'USD',
    cells: [
      { value: 23.568, change: -0.146, trend: 'down' },
      { value: 36.143, change: -0.056, trend: 'down' }
    ]
  },
  {
    code: 'EUR',
    cells: [
      { value: 17.376, change: -0.056, trend: 'up' },
      { value: 21.113, change: -0.087, trend: 'up' }
    ]
  },
  {
    code: 'GBP',
    cells: [
      { value: 12.766, change: -0.056, trend: 'down' },
      { value: 36.076, change: -0.087, trend: 'down' }
    ]
  }
];

const PLOT_HEIGHT = 121;
const PLOT_WIDTH = 426;

const asPercent = (px: number, of: number) => (px / of) * 100;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [IonContent, DecimalPipe],
  animations: [fadeIn, tabEntry],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './home.component.scss'
})
export class HomeComponent extends TabPage {
  private dataService = inject(DataService);

  readonly rows = ROWS;
  readonly activeCode = 'USD';
  readonly columnHeadings = ['Lorem', 'Ipsum', 'Dolor'];
  readonly chartTitle = 'Lorem ipsum 2021';

  readonly chartLabels = [
    { text: 'Sit', left: asPercent(2, PLOT_WIDTH) },
    { text: 'Ipsum', left: asPercent(150, PLOT_WIDTH) },
    { text: 'Dolor', left: asPercent(279, PLOT_WIDTH) }
  ];

  readonly chartGroups = computed(() =>
    this.dataService.chartBars().map(group => group.map(h => asPercent(h, PLOT_HEIGHT)))
  );

  goBack() {
    this.navigate('/currency', 'back');
  }
}
