import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './environment';

@Injectable({
  providedIn: 'root'
})
export class SuspectServiceService {
  private baseUrl = `${environment.ipAddUrl}api/suspect`;

  constructor(private http: HttpClient) {}

  // Retrieve all suspects
  retrieveAllSuspects(): Observable<any> {
    return this.http.get(`${this.baseUrl}/collect/all`);
  }

  // Retrieve all prisoners
  retrieveAllPrisoners(): Observable<any> {
    return this.http.get(`${this.baseUrl}/collect/prison`);
  }

  // Retrieve all wanted suspects
  retrieveAllWanteds(): Observable<any> {
    return this.http.get(`${this.baseUrl}/collect/freedom`);
  }

  // Identify a specific criminal by ID
  identifyCriminal(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/verify/${id}`);
  }

  // Establish a new criminal record
  establishCriminal(suspect: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, suspect);
  }

  // Connect a suspect to a specific crime
  connectToCrime(request: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/connect/specific`, request);
  }

  // Edit an existing criminal record
  editCriminal(id: number, suspect: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/edit/${id}`, suspect);
  }

  // Delete a suspect record by ID
  clearName(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/discard/${id}`);
  }
}
