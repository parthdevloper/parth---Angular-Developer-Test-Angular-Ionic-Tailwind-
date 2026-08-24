import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export const AUTH_STORAGE_KEY = 'auth_user';

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  image: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API = 'https://dummyjson.com/auth';

  private http = inject(HttpClient);

  private _user = signal<AuthResponse | null>(null);
  private _loading = signal(false);
  private _error = signal<string | null>(null);

  readonly loading = this._loading.asReadonly();
  readonly isAuthenticated = computed(() => !!this._user()?.accessToken);
  readonly error = this._error.asReadonly();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    const stored = sessionStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      try {
        this._user.set(JSON.parse(stored));
      } catch {
        sessionStorage.removeItem(AUTH_STORAGE_KEY);
        // console.log('Failed to parse stored auth user, clearing storage');
      }
    }
  }

  async login(username: string, password: string): Promise<boolean> {
    this._loading.set(true);
    this._error.set(null);

    try {
      const resp = await firstValueFrom(
        this.http.post<AuthResponse>(`${this.API}/login`, {
          username,
          password,
          expiresInMins: 60
        })
      );

      if (resp) {
        this.store(resp);
      return true;
      }
      return false;
    } catch (e) {
      const message = e instanceof HttpErrorResponse ? e.error?.message : null;
      this._error.set(message || 'Login failed');
      return false;
    } finally {
      this._loading.set(false);
    }
  }

  private store(user: AuthResponse) {
    this._user.set(user);
    sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  }
}
