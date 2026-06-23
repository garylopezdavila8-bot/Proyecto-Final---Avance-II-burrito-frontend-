import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Resena } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class ResenasService {
  constructor(private readonly http: HttpClient) {}

  getAll() {
    return this.http.get<Resena[]>(`${environment.apiUrl}/resenas`);
  }

  getByLibro(libroId: number) {
    return this.http.get<Resena[]>(`${environment.apiUrl}/resenas/libro/${libroId}`);
  }

  getMine() {
    return this.http.get<Resena[]>(`${environment.apiUrl}/resenas/mis-resenas`);
  }

  create(payload: { libroId: number; calificacion: number; comentario?: string }) {
    return this.http.post<Resena>(`${environment.apiUrl}/resenas`, payload);
  }

  update(id: number, payload: { calificacion?: number; comentario?: string }) {
    return this.http.patch<Resena>(`${environment.apiUrl}/resenas/${id}`, payload);
  }

  delete(id: number) {
    return this.http.delete<{ message: string }>(`${environment.apiUrl}/resenas/${id}`);
  }
}
