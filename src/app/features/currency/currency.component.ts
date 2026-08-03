import { Component, inject, AfterViewInit, viewChild, ElementRef, effect, signal, afterNextRender, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
  IonBackButton, IonButton, IonIcon, IonList, IonItem,
  IonSegment, IonSegmentButton
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { menuOutline, arrowUp, arrowDown, caretUp, caretDown, ellipsisHorizontal } from 'ionicons/icons';
import { Chart, registerables } from 'chart.js';
import { DataService } from '../../core/services/data.service';
import { NavDirectionService } from '../../core/services/nav-direction.service';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';
import { CountUpDirective } from '../../shared/directives/count-up.directive';
import { fadeIn, tabEntry } from '../../shared/animations/route.animations';
// import { HttpClient } from '@angular/common/http';

Chart.register(...registerables);

@Component({
  selector: 'app-currency',
  standalone: true,
  imports: [
    DecimalPipe,
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
    IonBackButton, IonButton, IonIcon, IonList, IonItem,
    IonSegment, IonSegmentButton, SkeletonComponent, CountUpDirective
  ],
  animations: [fadeIn, tabEntry],
  templateUrl: './currency.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './currency.component.scss'
})
export class CurrencyComponent implements AfterViewInit {
  protected dataService = inject(DataService);
  private chartCanvas = viewChild<ElementRef<HTMLCanvasElement>>('chartCanvas');
  private chart: Chart | null = null;
  private chartReady = signal(false);
  private navDirection = inject(NavDirectionService);
  
  @HostBinding('@tabEntry') get slideIn() { return this.navDirection.direction(); }
  
  loaded = signal(false);

  constructor() {
    addIcons({ menuOutline, arrowUp, arrowDown, ellipsisHorizontal });
    afterNextRender(() => this.loaded.set(true));

    effect(() => {
      const data = this.dataService.currencyChartData();
      const canvas = this.chartCanvas();
      if (this.chart) {
        this.chart.data.datasets[0].data = data;
        this.chart.update('active');
      } else if (canvas && !this.chartReady()) {
        this.createChart();
      }
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.chartCanvas() && !this.chart) {
        this.createChart();
      }
    }, 100);
  }

  private createChart() {
    const canvas = this.chartCanvas();
    if (!canvas) return;
    
    const ctx = canvas.nativeElement.getContext('2d');
    if (!ctx) return;

    this.chartReady.set(true);

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['USD', 'EUR', 'GBP', 'JPY', 'CHF'],
        datasets: [{
          data: this.dataService.currencyChartData(),
          backgroundColor: [
            '#4361ee', '#7094f7', '#4361ee', '#7094f7', '#4361ee'
          ],
          borderRadius: 6,
          barThickness: 24
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: '#a0aec0' }
          },
          y: {
            grid: { color: 'rgba(255,255,255,0.05)' },
            ticks: { color: '#a0aec0' }
          }
        },
        animation: {
          duration: 800,
          easing: 'easeOutQuart',
          delay: (ctx) => ctx.dataIndex * 100
        }
      }
    });
  }
}
