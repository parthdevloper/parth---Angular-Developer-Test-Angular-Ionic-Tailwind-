import { Routes } from '@angular/router';
import { TabsComponent } from './tabs.component';

export const tabsRoutes: Routes = [
  {
    path: '',
    component: TabsComponent,
    children: [
      {
        path: 'home',
        loadComponent: () => import('../../features/home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'currency',
        loadComponent: () => import('../../features/currency/currency.component').then(m => m.CurrencyComponent)
      },
      {
        path: 'analytics',
        loadComponent: () => import('../../features/analytics/analytics.component').then(m => m.AnalyticsComponent)
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      }
    ]
  }
];
