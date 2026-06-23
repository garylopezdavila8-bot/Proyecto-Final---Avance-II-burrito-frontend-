import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LibrosService } from '../../../core/services/libros.service';
import { Libro } from '../../../core/models/api.models';

@Component({
  selector: 'app-libros-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './libros.html',
  styleUrl: './libros.css',
})
export class LibrosAdmin implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly librosService = inject(LibrosService);

  libros = signal<Libro[]>([]);
  loading = signal(true);
  saving = signal(false);
  editingId = signal<number | null>(null);
  message = signal('');
  errorMessage = signal('');

  libroForm = this.fb.group({
    titulo: ['', Validators.required],
    autor: ['', Validators.required],
    editorial: ['', Validators.required],
    genero: ['', Validators.required],
    sinopsis: ['', Validators.required],
    imagen: [null as File | null],
  });

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
        this.errorMessage.set('No fue posible cargar los libros.');
        this.loading.set(false);
      },
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.libroForm.patchValue({ imagen: input.files?.[0] ?? null });
  }

  editar(libro: Libro): void {
    this.editingId.set(libro.id);
    this.libroForm.patchValue({
      titulo: libro.titulo,
      autor: libro.autor,
      editorial: libro.editorial,
      genero: libro.genero,
      sinopsis: libro.sinopsis,
      imagen: null,
    });
  }

  cancelarEdicion(): void {
    this.editingId.set(null);
    this.libroForm.reset();
  }

  guardar(): void {
    if (this.libroForm.invalid) {
      return;
    }

    const formData = new FormData();
    const value = this.libroForm.value;
    formData.append('titulo', value.titulo!);
    formData.append('autor', value.autor!);
    formData.append('editorial', value.editorial!);
    formData.append('genero', value.genero!);
    formData.append('sinopsis', value.sinopsis!);
    if (value.imagen) {
      formData.append('imagen', value.imagen);
    }

    this.saving.set(true);
    this.message.set('');
    this.errorMessage.set('');

    const request = this.editingId()
      ? this.librosService.update(this.editingId()!, formData)
      : this.librosService.create(formData);

    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.message.set(this.editingId() ? 'Libro actualizado.' : 'Libro creado.');
        this.cancelarEdicion();
        this.cargarLibros();
      },
      error: (err) => {
        this.saving.set(false);
        this.errorMessage.set(err.error?.message ?? 'No fue posible guardar el libro.');
      },
    });
  }

  eliminar(id: number): void {
    if (!confirm('¿Deseas eliminar este libro?')) {
      return;
    }

    this.librosService.delete(id).subscribe({
      next: () => {
        this.message.set('Libro eliminado.');
        this.cargarLibros();
      },
      error: () => this.errorMessage.set('No fue posible eliminar el libro.'),
    });
  }

  getImageUrl(imagenUrl: string | null): string {
    return this.librosService.getImageUrl(imagenUrl);
  }

  salir(): void {
    this.authService.logout('/burritoadministrador/login');
  }
}
