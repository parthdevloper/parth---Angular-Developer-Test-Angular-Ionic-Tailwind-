import { Component, inject, signal, afterNextRender } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonContent, IonSpinner } from '@ionic/angular/standalone';
import { AuthService } from '../../core/services/auth.service';
import { fadeIn } from '../../shared/animations/route.animations';

@Component({
  selector: 'app-login',
  imports: [FormsModule, IonContent, IonSpinner],
  animations: [fadeIn],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  protected auth = inject(AuthService);
  private router = inject(Router);

  username = '';
  password = '';
  showPassword = signal(false);
  loaded = signal(false);

  constructor() {
    afterNextRender(() => this.loaded.set(true));
  }

  async submit() {
    if (!this.username || !this.password) return;

    if (await this.auth.login(this.username, this.password)) {
      this.router.navigate(['/home']);
    }
  }
}
