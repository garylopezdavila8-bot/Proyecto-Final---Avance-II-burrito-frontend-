import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { AfinidadesService } from '../../../core/services/afinidades.service';
import { UsuarioAfin } from '../../../core/models/api.models';

@Component({
  selector: 'app-afinidad',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './afinidad.html',
  styleUrl: './afinidad.css',
})
export class Afinidad implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly afinidadesService = inject(AfinidadesService);

  afinidades = signal<UsuarioAfin[]>([]);
  loading = signal(true);
  errorMessage = signal('');

  ngOnInit(): void {
    this.afinidadesService.getMisAfinidades().subscribe({
      next: (data) => {
        this.afinidades.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('No fue posible calcular tus afinidades.');
        this.loading.set(false);
      },
    });
  }

  salir(): void {
    this.authService.logout('/burritolector/login');
  }
}
