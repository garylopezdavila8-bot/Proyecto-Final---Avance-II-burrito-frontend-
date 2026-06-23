import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { DashboardService } from '../../../core/services/dashboard.service';
import { DashboardAdminStats } from '../../../core/models/api.models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly dashboardService = inject(DashboardService);

  stats = signal<DashboardAdminStats | null>(null);
  loading = signal(true);
  errorMessage = signal('');

  readonly currentUser = this.authService.currentUser;

  ngOnInit(): void {
    this.dashboardService.getAdminStats().subscribe({
      next: (stats) => {
        this.stats.set(stats);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('No fue posible cargar las estadísticas del sistema.');
        this.loading.set(false);
      },
    });
  }

  salir(): void {
    this.authService.logout('/burritoadministrador/login');
  }
}
