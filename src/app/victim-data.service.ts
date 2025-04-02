import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './environment';

@Injectable({
  providedIn: 'root'
})
export class VictimDataService {

  private apiUrl = `${environment.ipAddUrl}`;
   private token = localStorage.getItem('token') ?? '';
    private auth_token = new HttpHeaders({
        'Authorization': this.token
      });

  constructor(private http: HttpClient) { }

  // Fetch all victims
  getAllVictims(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}api/victim/retrieve/all` , {headers: this.auth_token});
  }

  retrieveReportedVictim(reportId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}api/victim/fromreport/${reportId}` , {headers: this.auth_token});
  }

  // Fetch a single victim by ID
  getVictimById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}api/victim/retrieve/${id}` , {headers: this.auth_token});
  }

  // Fetch all affected cases by victim ID
  getAffectedCases(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}api/victim/retrieve/cases/${id}` , {headers: this.auth_token});
  }

  // Establish a new victim
  createVictim(victimData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, victimData , {headers: this.auth_token});
  }

  // Establish a new victim with report ID
  createVictimFromReport(victimData: any, reportId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}api/victim/fromreport/${reportId}`, victimData , {headers: this.auth_token});
  }

  // Edit an existing victim
  editVictim(id: number, victimData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}api/victim/edit/${id}`, victimData , {headers: this.auth_token});
  }

  getDescription(id: number): Observable<any> {

    const url = `${environment.ipAddUrl}api/description/person/${id}`;
    return this.http.get( url , {headers: this.auth_token});
  }

  // Discard a victim
  deleteVictim(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/discard/${id}` , {headers: this.auth_token});
  }
}
