import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './environment';


@Injectable({
  providedIn: 'root'
})
export class CrimeService {
  private baseUrl = `${environment.ipAddUrl}api/case`;
  private modusLists = 'assets/modus';
  private token = localStorage.getItem('token') ?? '';

  private auth_token = new HttpHeaders({
      'Authorization': this.token
    });
 


  constructor(private http: HttpClient) {}

  // GET Methods
  getNationwideCases(): Observable<any> {
    return this.http.get(`${this.baseUrl}/retrieve/nationwide`, {headers: this.auth_token});
  }

  getIncidentTypes(): Observable<any> {
    return this.http.get(`${this.baseUrl}/load/incidenttypes`, {headers: this.auth_token});
  }

  getLocalCases(stationId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/retrieve/local/${stationId}`, {headers: this.auth_token});
  }

  getModus(): Observable<any[]> {
    return this.http.get<any[]>(`${this.modusLists}/modus.json`); 
  }

  getInvolvedCases(suspectId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/retrieve/suspect/${suspectId}`, {headers: this.auth_token});
  }

  getSpecificCase(crimeId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/retrieve/specific/${crimeId}`, {headers: this.auth_token});
  }

  getFurtherCase(crimeId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/retrieve/further/${crimeId}`, {headers: this.auth_token});
  }

  getOngoingCases(stationId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/retrieve/ongoing/${stationId}`, {headers: this.auth_token});
  }

  getOngoingCasesCount(stationId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/retrieve/ongoing/count/${stationId}`, {headers: this.auth_token});
  }

  getSolvedCases(stationId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/retrieve/solved/${stationId}`, {headers: this.auth_token});
  }

  getAssignedTeam(crimeId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/collect/assignedteam/${crimeId}`, {headers: this.auth_token});
  }

  // POST Method
  establishCase(crimeData: any): Observable<any> {
    return this.http.post(this.baseUrl, crimeData, {headers: this.auth_token});
  }

  // PUT Methods
  endorseCase(crimeId: number, policeId: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/endorse/case/${crimeId}/${policeId}`, {headers: this.auth_token});
  }

  endorseCaseMany(crimeId: number, policeIds: number[]): Observable<any> {
    return this.http.put(`${this.baseUrl}/endorse/case/many/${crimeId}`, policeIds, {headers: this.auth_token});
  }

  connectVictim(crimeId: number, victimId: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/establish/victim/${crimeId}/${victimId}`, {headers: this.auth_token});
  }

  markSolved(crimeId: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/mark/solved/${crimeId}`, {}, {headers: this.auth_token});
  }

  updateCase(crimeId: number, crimeData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/up/${crimeId}`, crimeData, {headers: this.auth_token});
  }



  // // Interface for type safety
  // interface CrimeRequestDto {
  //   police_id_list?: number[];
  //   victim_id_list?: number[];
  //   suspect_id_list?: number[];
  //   // Add other properties based on your backend DTO
  // }
}