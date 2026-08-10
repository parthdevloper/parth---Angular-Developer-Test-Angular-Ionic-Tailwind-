import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { DataService } from '../../core/services/data.service';
import { VerticalSliderComponent } from '../../shared/components/vertical-slider/vertical-slider.component';
import { TabPage } from '../../shared/tab-page.base';
import { fadeIn, tabEntry } from '../../shared/animations/route.animations';

@Component({
  selector: 'app-currency',
  standalone: true,
  imports: [IonContent, VerticalSliderComponent],
  animations: [fadeIn, tabEntry],
  templateUrl: './currency.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './currency.component.scss'
})
export class CurrencyComponent extends TabPage {
  protected dataService = inject(DataService);

  readonly sliderMin = 0;
  readonly sliderMax = 2100;
  readonly sliderStep = 100;
  readonly ticks = [2000, 1500, 1000, 500, 100];

  readonly userName = 'Lorem Name';
  readonly userHandle = 'Lorem Name';

  showRates(value: number) {
    this.dataService.selectCard(value);
    this.navigate('/home', 'forward');
  }

  openAnalytics() {
    this.navigate('/analytics', 'forward');
  }
}
