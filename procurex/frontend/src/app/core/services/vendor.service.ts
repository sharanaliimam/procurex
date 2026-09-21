import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Vendor } from '../models/models';

@Injectable({ providedIn: 'root' })
export class VendorService {
  private base = `${environment.apiUrl}/vendors`;

  constructor(private http: HttpClient) {}

  getAll(filters: { search?: string; status?: string } = {}): Observable<Vendor[]> {
    let params = new HttpParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v) params = params.set(k, v);
    });
    return this.http.get<Vendor[]>(this.base, { params });
  }

  create(vendor: Partial<Vendor>): Observable<Vendor> {
    return this.http.post<Vendor>(this.base, vendor);
  }

  update(id: string, vendor: Partial<Vendor>): Observable<Vendor> {
    return this.http.put<Vendor>(`${this.base}/${id}`, vendor);
  }

  delete(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.base}/${id}`);
  }
}
