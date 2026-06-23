import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
 
  stats = signal({ lectores: 0, libros: 0, promedio: 0 });
  libros = signal<any[]>([]);
  
  libroForm: FormGroup;
  fotoSeleccionada: File | null = null;
  editandoId: number | null = null;
  mostrarFormulario = false;

  private apiLibros = 'http://localhost:3000/libros';
  private apiStats = 'http://localhost:3000/dashboard/stats';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.libroForm = this.fb.group({
      titulo: ['', Validators.required],
      autor: ['', Validators.required],
      editorial: ['', Validators.required],
      genero: ['', Validators.required],
      sinopsis: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {

    this.http.get<any>(this.apiStats).subscribe(res => this.stats.set(res));

    this.http.get<any[]>(this.apiLibros).subscribe(res => this.libros.set(res));
  }

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.fotoSeleccionada = event.target.files[0];
    }
  }

  guardarLibro() {
    if (this.libroForm.invalid) return;

    const formData = new FormData();
    Object.keys(this.libroForm.value).forEach(key => {
      formData.append(key, this.libroForm.value[key]);
    });
    if (this.fotoSeleccionada) {
      formData.append('imagen', this.fotoSeleccionada);
    }

    if (this.editandoId) {

      this.http.put(`${this.apiLibros}/${this.editandoId}`, formData).subscribe(() => {
        this.limpiarFormulario();
        this.cargarDatos();
      });
    } else {
      // Crear
      this.http.post(this.apiLibros, formData).subscribe(() => {
        this.limpiarFormulario();
        this.cargarDatos();
      });
    }
  }

  editarLibro(libro: any) {
    this.editandoId = libro.id;
    this.mostrarFormulario = true;
    this.libroForm.patchValue(libro);
  }

  eliminarLibro(id: number) {
    if (confirm('¿Seguro que deseas eliminar este libro?')) {
      this.http.delete(`${this.apiLibros}/${id}`).subscribe(() => this.cargarDatos());
    }
  }

  limpiarFormulario() {
    this.libroForm.reset();
    this.fotoSeleccionada = null;
    this.editandoId = null;
    this.mostrarFormulario = false;
  }
}