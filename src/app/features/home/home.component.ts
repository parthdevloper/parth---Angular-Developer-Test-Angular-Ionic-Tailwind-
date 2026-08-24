import { Component, computed, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { IonContent } from '@ionic/angular/standalone';
import { DataService } from '../../core/services/data.service';
import { TabPage } from '../../shared/tab-page.base';
import { fadeIn, tabEntry } from '../../shared/animations/route.animations';

const RATE_ROWS = [
  {
    code: 'USD',
    cells: [
      { value: 23.568, change: -0.146 },
      { value: 36.143, change: -0.056 },
    ],
  },
  {
    code: 'EUR',
    cells: [
      { value: 17.376, change: 0.056 },
      { value: 21.113, change: 0.087 },
    ],
  },
  {
    code: 'GBP',
    cells: [
      { value: 12.766, change: -0.056 },
      { value: 36.076, change: -0.087 },
    ],
  },
];

const PLOT_HEIGHT = 121;

const asPercent = (px: number, of: number) => (px / of) * 100;

@Component({
  selector: 'app-home',
  imports: [IonContent, DecimalPipe],
  animations: [fadeIn, tabEntry],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent extends TabPage {
  private dataService = inject(DataService);

  readonly rows = RATE_ROWS.map((row) => ({
    ...row,
    cells: row.cells.map((cell) => ({ ...cell, trend: cell.change < 0 ? 'down' : 'up' })),
  }));

  readonly activeCode = 'USD';
  readonly columnHeadings = ['Lorem', 'Ipsum', 'Dolor'];
  readonly chartTitle = 'Lorem ipsum 2021';
  readonly chartLabels = [
    { text: 'Sit', x: 2 },
    { text: 'Ipsum', x: 150 },
    { text: 'Dolor', x: 279 },
  ];

  readonly chartGroups = computed(() =>
    this.dataService.chartBars().map((group) => group.map((h) => asPercent(h, PLOT_HEIGHT))),
  );

  goBack() {
    this.navigate('/currency', 'back');
  }
}
