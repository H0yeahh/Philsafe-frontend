import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './environment';

@Injectable({
  providedIn: 'root'
})
export class VictimDataService {

  private apiUrl = `${environment.ipAddUrl}`;

  constructor(private http: HttpClient) { }

  // Fetch all victims
  getAllVictims(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}api/victim/retrieve/all`);
  }

  // Fetch a single victim by ID
  getVictimById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}api/victim/retrieve/${id}`);
  }

  // Fetch all affected cases by victim ID
  getAffectedCases(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}api/victim/retrieve/cases/${id}`);
  }

  // Establish a new victim
  createVictim(victimData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, victimData);
  }

  // Establish a new victim with report ID
  createVictimFromReport(victimData: any, reportId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}api/victim/fromreport/${reportId}`, victimData);
  }

  // Edit an existing victim
  editVictim(id: number, victimData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}api/victim/edit/${id}`, victimData);
  }

  // Discard a victim
  deleteVictim(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/discard/${id}`);
  }
}
