import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, SessionUser } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly storageKey = 'sesion_burrito';
  private readonly sessionSignal = signal<SessionUser | null>(this.loadSession());

  readonly session = this.sessionSignal.asReadonly();
  readonly isAuthenticated = computed(() => this.sessionSignal() !== null);
  readonly isAdmin = computed(() => this.sessionSignal()?.rol === 'admin');
  readonly isLector = computed(() => this.sessionSignal()?.rol === 'lector');
  readonly currentUser = computed(() => this.sessionSignal());

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
  ) {}

  register(nombre: string, email: string, password: string) {
    return this.http.post<{ message: string }>(`${environment.apiUrl}/auth/register`, {
      nombre,
      email,
      password,
    });
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, { email, password }).pipe(
      tap((response) => {
        const session: SessionUser = {
          id: response.id,
          email,
          nombre: response.nombre,
          rol: response.rol,
          token: response.access_token,
        };
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem(this.storageKey, JSON.stringify(session));
        }
        this.sessionSignal.set(session);
      }),
    );
  }

  logout(redirectTo: string): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(this.storageKey);
    }
    this.sessionSignal.set(null);
    this.router.navigate([redirectTo]);
  }

  getToken(): string | null {
    return this.sessionSignal()?.token ?? null;
  }

  private loadSession(): SessionUser | null {
    if (typeof window === 'undefined' || !window.localStorage) {
      return null;
    }

    const raw = localStorage.getItem(this.storageKey);
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as SessionUser;
    } catch {
      return null;
    }
  }
}
