import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Bid } from '../models/models';

@Injectable({ providedIn: 'root' })
export class BidService {
  private base = `${environment.apiUrl}/bids`;

  constructor(private http: HttpClient) {}

  getAll(filters: { tender?: string; vendor?: string; status?: string } = {}): Observable<Bid[]> {
    let params = new HttpParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v) params = params.set(k, v);
    });
    return this.http.get<Bid[]>(this.base, { params });
  }

  create(bid: Partial<Bid>): Observable<Bid> {
    return this.http.post<Bid>(this.base, bid);
  }

  update(id: string, bid: Partial<Bid>): Observable<Bid> {
    return this.http.put<Bid>(`${this.base}/${id}`, bid);
  }

  delete(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.base}/${id}`);
  }
}
