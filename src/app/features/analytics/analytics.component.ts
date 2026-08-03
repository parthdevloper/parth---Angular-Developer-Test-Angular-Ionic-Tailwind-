import { Component, inject, AfterViewInit, viewChild, ElementRef, effect, signal, afterNextRender, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
  IonBackButton, IonButton, IonIcon, IonSegment, IonSegmentButton
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { settingsOutline } from 'ionicons/icons';
import { Chart, registerables } from 'chart.js';
import { DataService } from '../../core/services/data.service';
import { NavDirectionService } from '../../core/services/nav-direction.service';
import { CountUpDirective } from '../../shared/directives/count-up.directive';
import { fadeIn, tabEntry } from '../../shared/animations/route.animations';

Chart.register(...registerables);

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
    IonBackButton, IonButton, IonIcon, IonSegment, IonSegmentButton,
    CountUpDirective
  ],
  animations: [fadeIn, tabEntry],
  templateUrl: './analytics.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './analytics.component.scss'
})
export class AnalyticsComponent implements AfterViewInit {
  protected dataService = inject(DataService);
  private chartCanvas = viewChild<ElementRef<HTMLCanvasElement>>('chartCanvas');
  private chart: Chart | null = null;
  private chartReady = signal(false);
  private navDirection = inject(NavDirectionService);
  
  @HostBinding('@tabEntry') get slideIn() { return this.navDirection.direction(); }
  
  loaded = signal(false);

  constructor() {
    addIcons({ settingsOutline });
    afterNextRender(() => this.loaded.set(true));

    effect(() => {
      const data = this.dataService.analyticsData();
      const canvas = this.chartCanvas();
      if (this.chart) {
        this.chart.data.datasets[0].data = data.breakdown.map(b => b.value);
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
    const data = this.dataService.analyticsData();

    this.chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: data.breakdown.map(b => b.label),
        datasets: [{
          data: data.breakdown.map(b => b.value),
          backgroundColor: data.breakdown.map(b => b.color),
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        cutout: '70%',
        plugins: {
          legend: { display: false }
        },
        animation: {
          animateRotate: true,
          animateScale: true,
          duration: 1000,
          easing: 'easeOutQuart'
        }
      }
    });
  }
}
