import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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

  private _user = signal<AuthResponse | null>(null);
  private _loading = signal(false);
  private _error = signal<string | null>(null);
  
  readonly user = this._user.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly isAuthenticated = computed(() => !!this._user()?.accessToken);
  readonly error = this._error.asReadonly();

  constructor(private http: HttpClient) {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    const stored = sessionStorage.getItem('auth_user');
    if (stored) {
      try {
        this._user.set(JSON.parse(stored));
      } catch {
        sessionStorage.removeItem('auth_user');
      }
    }
  }

  async login(username: string, password: string): Promise<boolean> {
    this._loading.set(true);
    this._error.set(null);

    try {
      const resp = await this.http.post<AuthResponse>(`${this.API}/login`, {
        username,
        password,
        expiresInMins: 60
      }).toPromise();

      if (resp) {
        this._user.set(resp);
        sessionStorage.setItem('auth_user', JSON.stringify(resp));
        return true;
      }
      return false;
    } catch (e: any) {
      this._error.set(e?.error?.message || 'Login failed');
      return false;
    } finally {
      this._loading.set(false);
    }
  }

  logout() {
    this._user.set(null);
    sessionStorage.removeItem('auth_user');
  }

  async refreshToken(): Promise<boolean> {
    const current = this._user();
    if (!current?.refreshToken) return false;

    try {
      const resp = await this.http.post<AuthResponse>(`${this.API}/refresh`, {
        refreshToken: current.refreshToken,
        expiresInMins: 60
      }).toPromise();

      if (resp) {
        this._user.set(resp);
        sessionStorage.setItem('auth_user', JSON.stringify(resp));
        return true;
      }
      return false;
    } catch {
      this.logout();
      return false;
    }
  }
}
