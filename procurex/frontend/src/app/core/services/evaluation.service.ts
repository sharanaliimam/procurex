import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Evaluation } from '../models/models';

@Injectable({ providedIn: 'root' })
export class EvaluationService {
  private base = `${environment.apiUrl}/evaluations`;

  constructor(private http: HttpClient) {}

  getAll(filters: { tender?: string; status?: string } = {}): Observable<Evaluation[]> {
    let params = new HttpParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v) params = params.set(k, v);
    });
    return this.http.get<Evaluation[]>(this.base, { params });
  }

  create(evaluation: Partial<Evaluation>): Observable<Evaluation> {
    return this.http.post<Evaluation>(this.base, evaluation);
  }

  update(id: string, evaluation: Partial<Evaluation>): Observable<Evaluation> {
    return this.http.put<Evaluation>(`${this.base}/${id}`, evaluation);
  }

  delete(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.base}/${id}`);
  }
}
