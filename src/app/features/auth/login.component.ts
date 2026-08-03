import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonInput, IonButton, IonSpinner, IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { eyeOutline, eyeOffOutline, personOutline, lockClosedOutline } from 'ionicons/icons';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    IonContent, IonInput, IonButton, IonSpinner, IonIcon
  ],
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  protected authService = inject(AuthService);
  private router = inject(Router);

  username = '';
  password = '';
  showPassword = signal(false);  // toggle pw visibility

  constructor() {
    addIcons({ eyeOutline, eyeOffOutline, personOutline, lockClosedOutline });
    
    // redirect if already logged in
    if (this.authService.isAuthenticated()) {
      // console.log('LoginComponent: user is already authenticated, redirecting to /home');
      this.router.navigate(['/home']);
    }
  }

  async handleLogin() {
    if (!this.username || !this.password) return;
    
    const success = await this.authService.login(this.username, this.password);
    if (success) {
      this.router.navigate(['/home']);
    }
  }
}
