import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { DashboardService } from './core/services/dashboard.service';
import { AuthService } from './core/services/auth.service';
import { AppNotification, AuthUser } from './core/models/models';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ProcureX';
  notifications: AppNotification[] = [];
  user: AuthUser | null = null;

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService,
    private router: Router
  ) {
    this.authService.currentUser$.subscribe((user) => {
      this.user = user;
      if (user) {
        this.dashboardService.getNotifications().subscribe((data) => (this.notifications = data));
      } else {
        this.notifications = [];
      }
    });
  }

  navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: 'dashboard', roles: ['admin', 'vendor'] },
    { path: '/tenders', label: 'Tenders', icon: 'description', roles: ['admin', 'vendor'] },
    { path: '/vendors', label: 'Vendors', icon: 'business', roles: ['admin'] },
    { path: '/bids', label: 'Bids', icon: 'gavel', roles: ['admin', 'vendor'] },
    { path: '/evaluations', label: 'Evaluation', icon: 'fact_check', roles: ['admin'] },
    { path: '/documents', label: 'Documents', icon: 'folder', roles: ['admin'] },
    { path: '/notifications', label: 'Notifications', icon: 'notifications', roles: ['admin', 'vendor'] },
    { path: '/reports', label: 'Reports', icon: 'bar_chart', roles: ['admin'] }
  ];

  get visibleNavLinks() {
    return this.navLinks.filter((link) => !this.user || !link.roles || link.roles.includes(this.user.role));
  }

  logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}
