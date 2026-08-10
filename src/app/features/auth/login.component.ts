import { Component, inject, signal, afterNextRender, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonContent, IonSpinner } from '@ionic/angular/standalone';
import { AuthService } from '../../core/services/auth.service';
import { fadeIn } from '../../shared/animations/route.animations';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, IonContent, IonSpinner],
  animations: [fadeIn],
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  protected authService = inject(AuthService);
  private router = inject(Router);

  username = '';
  password = '';
  showPassword = signal(false);
  loaded = signal(false);

  constructor() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/home']);
    }

    afterNextRender(() => this.loaded.set(true));
  }

  async handleLogin() {
    if (!this.username || !this.password) return;

    const success = await this.authService.login(this.username, this.password);
    if (success) {
      this.router.navigate(['/home']);
    }
  }
}
