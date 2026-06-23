import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { LibrosService } from '../../../core/services/libros.service';
import { ResenasService } from '../../../core/services/resenas.service';
import { Libro, Resena } from '../../../core/models/api.models';

@Component({
  selector: 'app-detalle-libro',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './detalle-libro.html',
  styleUrl: './detalle-libro.css',
})
export class DetalleLibro implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly librosService = inject(LibrosService);
  private readonly resenasService = inject(ResenasService);

  libro = signal<Libro | null>(null);
  resenas = signal<Resena[]>([]);
  loading = signal(true);
  saving = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  readonly currentUser = this.authService.currentUser;

  resenaForm = this.fb.group({
    calificacion: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
    comentario: [''],
  });

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.router.navigate(['/burritolector/galeria']);
      return;
    }

    this.librosService.getById(id).subscribe({
      next: (libro) => {
        this.libro.set(libro);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('No se encontró el libro solicitado.');
        this.loading.set(false);
      },
    });

    this.resenasService.getByLibro(id).subscribe({
      next: (resenas) => this.resenas.set(resenas),
    });
  }

  getImageUrl(imagenUrl: string | null): string {
    return this.librosService.getImageUrl(imagenUrl);
  }

  enviarResena(): void {
    const libro = this.libro();
    if (!libro || this.resenaForm.invalid) {
      return;
    }

    this.saving.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const { calificacion, comentario } = this.resenaForm.value;

    this.resenasService
      .create({
        libroId: libro.id,
        calificacion: Number(calificacion),
        comentario: comentario || undefined,
      })
      .subscribe({
        next: () => {
          this.saving.set(false);
          this.successMessage.set('Tu calificación fue registrada correctamente.');
          this.resenasService.getByLibro(libro.id).subscribe({
            next: (resenas) => this.resenas.set(resenas),
          });
        },
        error: (err) => {
          this.saving.set(false);
          this.errorMessage.set(err.error?.message ?? 'No fue posible guardar la reseña.');
        },
      });
  }

  salir(): void {
    this.authService.logout('/burritolector/login');
  }
}
