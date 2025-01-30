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

  private auth = new HttpHeaders({
      'Authorization': this.token
    });
 


  constructor(private http: HttpClient) {}

  // GET Methods
  getNationwideCases(): Observable<any> {
    return this.http.get(`${this.baseUrl}/retrieve/nationwide`, {headers: this.auth});
  }

  getIncidentTypes(): Observable<any> {
    return this.http.get(`${this.baseUrl}/load/incidenttypes`, {headers: this.auth});
  }

  getLocalCases(stationId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/retrieve/local/${stationId}`, {headers: this.auth});
  }

  getModus(): Observable<any[]> {
    return this.http.get<any[]>(`${this.modusLists}/modus.json`); 
  }

  getInvolvedCases(suspectId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/retrieve/suspect/${suspectId}`, {headers: this.auth});
  }

  getSpecificCase(crimeId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/retrieve/specific/${crimeId}`, {headers: this.auth});
  }

  getFurtherCase(crimeId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/retrieve/further/${crimeId}`, {headers: this.auth});
  }

  getOngoingCases(stationId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/retrieve/ongoing/${stationId}`, {headers: this.auth});
  }

  getOngoingCasesCount(stationId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/retrieve/ongoing/count/${stationId}`, {headers: this.auth});
  }

  getSolvedCases(stationId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/retrieve/solved/${stationId}`, {headers: this.auth});
  }

  getAssignedTeam(crimeId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/collect/assignedteam/${crimeId}`, {headers: this.auth});
  }

  // POST Method
  establishCase(crimeData: any): Observable<any> {
    return this.http.post(this.baseUrl, crimeData, {headers: this.auth});
  }

  // PUT Methods
  endorseCase(crimeId: number, policeId: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/endorse/case/${crimeId}/${policeId}`, {headers: this.auth});
  }

  endorseCaseMany(crimeId: number, policeIds: number[]): Observable<any> {
    return this.http.put(`${this.baseUrl}/endorse/case/many/${crimeId}`, policeIds, {headers: this.auth});
  }

  connectVictim(crimeId: number, victimId: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/establish/victim/${crimeId}/${victimId}`, {headers: this.auth});
  }

  markSolved(crimeId: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/mark/solved/${crimeId}`, {headers: this.auth});
  }

  updateCase(crimeId: number, crimeData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/up/${crimeId}`, crimeData, {headers: this.auth});
  }



  // // Interface for type safety
  // interface CrimeRequestDto {
  //   police_id_list?: number[];
  //   victim_id_list?: number[];
  //   suspect_id_list?: number[];
  //   // Add other properties based on your backend DTO
  // }
}