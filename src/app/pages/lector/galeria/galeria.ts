import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LibrosService } from '../../../core/services/libros.service';
import { Libro } from '../../../core/models/api.models';

@Component({
  selector: 'app-galeria',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './galeria.html',
  styleUrl: './galeria.css',
})
export class Galeria implements OnInit {
  private readonly librosService = inject(LibrosService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  libros = signal<Libro[]>([]);
  loading = signal(true);
  errorMessage = signal('');

  readonly currentUser = this.authService.currentUser;

  ngOnInit(): void {
    this.cargarLibros();
  }

  cargarLibros(): void {
    this.loading.set(true);
    this.librosService.getAll().subscribe({
      next: (libros) => {
        this.libros.set(libros);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('No fue posible cargar el catálogo de libros.');
        this.loading.set(false);
      },
    });
  }

  getImageUrl(imagenUrl: string | null): string {
    return this.librosService.getImageUrl(imagenUrl);
  }

  salir(): void {
    this.authService.logout('/burritolector/login');
  }
}
