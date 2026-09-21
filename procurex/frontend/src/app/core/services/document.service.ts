import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ProcureDocument } from '../models/models';

@Injectable({ providedIn: 'root' })
export class DocumentService {
  private base = `${environment.apiUrl}/documents`;

  constructor(private http: HttpClient) {}

  getAll(tender?: string): Observable<ProcureDocument[]> {
    let params = new HttpParams();
    if (tender) params = params.set('tender', tender);
    return this.http.get<ProcureDocument[]>(this.base, { params });
  }

  upload(formData: FormData): Observable<ProcureDocument> {
    return this.http.post<ProcureDocument>(this.base, formData);
  }

  delete(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.base}/${id}`);
  }

  downloadUrl(id: string): string {
    return `${this.base}/${id}/download`;
  }
}
