export interface AuthResponse {
  access_token: string;
  rol: string;
  id: number;
  nombre: string;
}

export interface SessionUser {
  id: number;
  email: string;
  nombre: string;
  rol: string;
  token: string;
}

export interface Libro {
  id: number;
  titulo: string;
  autor: string;
  editorial: string;
  genero: string;
  sinopsis: string;
  imagenUrl: string | null;
}

export interface Resena {
  id: number;
  calificacion: number;
  comentario: string | null;
  usuarioId: number;
  libroId: number;
  fechaCreacion: string;
  usuario?: { id: number; nombre: string; email: string };
  libro?: Libro;
}

export interface UsuarioAfin {
  usuarioId: number;
  nombre: string;
  email: string;
  librosEnComun: string[];
  porcentajeAfinidad: number;
}

export interface DashboardAdminStats {
  totalLectores: number;
  totalLibros: number;
  promedioRating: number;
}

export interface DashboardLector {
  misResenas: Resena[];
  usuariosAfines: UsuarioAfin[];
}
