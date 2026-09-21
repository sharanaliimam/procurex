import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Tender } from '../models/models';

@Injectable({ providedIn: 'root' })
export class TenderService {
  private base = `${environment.apiUrl}/tenders`;

  constructor(private http: HttpClient) {}

  getAll(filters: { status?: string; category?: string; search?: string } = {}): Observable<Tender[]> {
    let params = new HttpParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v) params = params.set(k, v);
    });
    return this.http.get<Tender[]>(this.base, { params });
  }

  getById(id: string): Observable<Tender> {
    return this.http.get<Tender>(`${this.base}/${id}`);
  }

  create(tender: Partial<Tender>): Observable<Tender> {
    return this.http.post<Tender>(this.base, tender);
  }

  update(id: string, tender: Partial<Tender>): Observable<Tender> {
    return this.http.put<Tender>(`${this.base}/${id}`, tender);
  }

  delete(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.base}/${id}`);
  }
}
