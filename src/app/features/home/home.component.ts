import { Component, inject, signal, computed, afterNextRender, HostBinding, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { 
  IonHeader, IonToolbar, IonContent, IonButton, IonButtons, IonIcon,
  IonCard, IonCardContent, IonAvatar, IonInput 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { menuOutline, logOutOutline, searchOutline, ellipsisHorizontal } from 'ionicons/icons';
import { VerticalSliderComponent } from '../../shared/components/vertical-slider/vertical-slider.component';
import { CountUpDirective } from '../../shared/directives/count-up.directive';
import { DataService } from '../../core/services/data.service';
import { AuthService } from '../../core/services/auth.service';
import { NavDirectionService } from '../../core/services/nav-direction.service';
import { fadeIn, tabEntry } from '../../shared/animations/route.animations';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonContent, IonButton, IonButtons, IonIcon,
    IonCard, IonCardContent, IonAvatar, IonInput,
    VerticalSliderComponent, CountUpDirective
  ],
  animations: [fadeIn, tabEntry],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  protected dataService = inject(DataService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private navDirection = inject(NavDirectionService);

  @HostBinding('@tabEntry') get slideIn() { return this.navDirection.direction(); }

  loaded = signal(false);
  pressedCard = signal<'left' | 'right' | null>(null);
  ctaPressed = signal(false);  // for btn press effect

  // pull user info from auth service
  userName = computed(() => {
    const user = this.authService.user();
    return user ? `${user.firstName} ${user.lastName}` : 'Guest';
  });

  userAvatar = computed(() => {
    const user = this.authService.user();
    return user?.image || 'https://i.pravatar.cc/100?img=3';
  });

  constructor() {
    addIcons({ menuOutline, logOutOutline, searchOutline, ellipsisHorizontal });
    afterNextRender(() => this.loaded.set(true));
  }

  onCardClick(value: number) {
    this.dataService.selectCard(value);
    this.router.navigate(['/currency']);
  }

  onCtaClick() {
    this.router.navigate(['/analytics']);
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
