import { Component, ChangeDetectionStrategy } from '@angular/core';
import { IonTabs } from '@ionic/angular/standalone';
import { BottomBarComponent } from '../../shared/components/bottom-bar/bottom-bar.component';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [IonTabs, BottomBarComponent],
  templateUrl: './tabs.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './tabs.component.scss'
})
export class TabsComponent {}
