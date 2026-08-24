import { Component } from '@angular/core';
import { IonTabs } from '@ionic/angular/standalone';
import { BottomBarComponent } from '../../shared/components/bottom-bar/bottom-bar.component';

@Component({
  selector: 'app-tabs',
  imports: [IonTabs, BottomBarComponent],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss',
})
export class TabsComponent {}
