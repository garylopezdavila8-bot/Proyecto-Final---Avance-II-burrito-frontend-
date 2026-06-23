import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Libro } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class LibrosService {
  constructor(private readonly http: HttpClient) {}

  getAll() {
    return this.http.get<Libro[]>(`${environment.apiUrl}/libros`);
  }

  getById(id: number) {
    return this.http.get<Libro>(`${environment.apiUrl}/libros/${id}`);
  }

  create(formData: FormData) {
    return this.http.post<Libro>(`${environment.apiUrl}/libros`, formData);
  }

  update(id: number, formData: FormData) {
    return this.http.put<Libro>(`${environment.apiUrl}/libros/${id}`, formData);
  }

  delete(id: number) {
    return this.http.delete<void>(`${environment.apiUrl}/libros/${id}`);
  }

  getImageUrl(imagenUrl: string | null): string {
    if (!imagenUrl) {
      return 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop';
    }

    if (imagenUrl.startsWith('http')) {
      return imagenUrl;
    }

    return `${environment.apiUrl}${imagenUrl}`;
  }
}
