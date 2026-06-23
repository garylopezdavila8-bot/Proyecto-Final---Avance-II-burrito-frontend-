import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { DashboardService } from '../../../core/services/dashboard.service';
import { Resena, UsuarioAfin } from '../../../core/models/api.models';

@Component({
  selector: 'app-dashboard-usuario',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard-usuario.html',
  styleUrl: './dashboard-usuario.css',
})
export class DashboardUsuario implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly dashboardService = inject(DashboardService);

  misResenas = signal<Resena[]>([]);
  usuariosAfines = signal<UsuarioAfin[]>([]);
  loading = signal(true);
  errorMessage = signal('');

  readonly currentUser = this.authService.currentUser;

  ngOnInit(): void {
    this.dashboardService.getLectorDashboard().subscribe({
      next: (data) => {
        this.misResenas.set(data.misResenas);
        this.usuariosAfines.set(data.usuariosAfines);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('No fue posible cargar tu dashboard.');
        this.loading.set(false);
      },
    });
  }

  salir(): void {
    this.authService.logout('/burritolector/login');
  }
}
