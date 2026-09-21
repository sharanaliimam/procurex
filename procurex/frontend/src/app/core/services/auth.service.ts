import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthUser, UserRole } from '../models/models';

const STORAGE_KEY = 'procurex-user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly currentUserSubject = new BehaviorSubject<AuthUser | null>(this.loadStoredUser());

  readonly currentUser$: Observable<AuthUser | null> = this.currentUserSubject.asObservable();

  private readonly demoUsers: Record<string, { password: string; user: AuthUser }> = {
    admin: {
      password: 'admin123',
      user: {
        username: 'admin',
        name: 'Procurement Admin',
        email: 'admin@procurex.com',
        role: 'admin'
      }
    },
    vendor: {
      password: 'vendor123',
      user: {
        username: 'vendor',
        name: 'Rahim Uddin',
        email: 'contact@techsource.com',
        role: 'vendor',
        vendorEmail: 'contact@techsource.com'
      }
    }
  };

  private get storedUsers(): Record<string, { password: string; user: AuthUser }> {
    const raw = localStorage.getItem('procurex-users');
    if (!raw) return {};

    try {
      return JSON.parse(raw) as Record<string, { password: string; user: AuthUser }>;
    } catch {
      localStorage.removeItem('procurex-users');
      return {};
    }
  }

  get currentUser(): AuthUser | null {
    return this.currentUserSubject.value;
  }

  get isLoggedIn(): boolean {
    return !!this.currentUser;
  }

  login(username: string, password: string): AuthUser | null {
    const trimmedUsername = username.trim().toLowerCase();
    const record = { ...this.demoUsers, ...this.storedUsers }[trimmedUsername];

    if (!record || record.password !== password) {
      return null;
    }

    this.currentUserSubject.next(record.user);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(record.user));
    return record.user;
  }

  signUp(payload: { username: string; name: string; email: string; password: string }): AuthUser | null {
    const username = payload.username.trim().toLowerCase();
    const email = payload.email.trim().toLowerCase();
    const allUsers = { ...this.demoUsers, ...this.storedUsers };

    if (!username || !payload.name.trim() || !email || !payload.password || allUsers[username]) {
      return null;
    }

    const user: AuthUser = {
      username,
      name: payload.name.trim(),
      email,
      role: 'vendor',
      vendorEmail: email
    };

    const store = { ...this.storedUsers, [username]: { password: payload.password, user } };
    localStorage.setItem('procurex-users', JSON.stringify(store));
    this.currentUserSubject.next(user);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    return user;
  }

  logout(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem(STORAGE_KEY);
  }

  private loadStoredUser(): AuthUser | null {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  }
}
