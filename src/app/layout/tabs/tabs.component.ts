import { Component, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { homeOutline, walletOutline, statsChartOutline } from 'ionicons/icons';
import { NavDirectionService } from '../../core/services/nav-direction.service';

const TAB_ORDER = ['currency', 'home', 'analytics'];

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon],
  templateUrl: './tabs.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './tabs.component.scss'
})
export class TabsComponent {
  private navDirection = inject(NavDirectionService);
  activeTab = 'home';

  constructor() {
    addIcons({ homeOutline, walletOutline, statsChartOutline });
  }

  onTabChange(event: { tab: string }) {
    const prevIdx = TAB_ORDER.indexOf(this.activeTab);
    const nextIdx = TAB_ORDER.indexOf(event.tab);
    
    this.navDirection.direction.set(nextIdx > prevIdx ? 'forward' : 'back');
    this.activeTab = event.tab;
  }
}
