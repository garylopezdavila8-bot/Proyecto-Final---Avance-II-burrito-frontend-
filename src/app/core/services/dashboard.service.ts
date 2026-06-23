import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { DashboardAdminStats, DashboardLector } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  constructor(private readonly http: HttpClient) {}

  getAdminStats() {
    return this.http.get<DashboardAdminStats>(`${environment.apiUrl}/dashboard/estadisticas`);
  }

  getLectorDashboard() {
    return this.http.get<DashboardLector>(`${environment.apiUrl}/dashboard/lector`);
  }
}
