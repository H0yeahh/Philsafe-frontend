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
    return this.http.get(`${this.baseUrl}/retrieve/nationwide`, {withCredentials: true});
  }

  getIncidentTypes(): Observable<any> {
    return this.http.get(`${this.baseUrl}/load/incidenttypes`, {withCredentials: true});
  }

  getLocalCases(stationId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/retrieve/local/${stationId}`, {withCredentials: true});
  }

  getModus(): Observable<any[]> {
    return this.http.get<any[]>(`${this.modusLists}/modus.json`); 
  }

  getInvolvedCases(suspectId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/retrieve/suspect/${suspectId}`, {withCredentials: true});
  }

  getSpecificCase(crimeId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/retrieve/specific/${crimeId}`, {withCredentials: true});
  }

  getFurtherCase(crimeId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/retrieve/further/${crimeId}`, {withCredentials: true});
  }

  getOngoingCases(stationId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/retrieve/ongoing/${stationId}`, {withCredentials: true});
  }

  getOngoingCasesCount(stationId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/retrieve/ongoing/count/${stationId}`, {withCredentials: true});
  }

  getSolvedCases(stationId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/retrieve/solved/${stationId}`, {withCredentials: true});
  }

  getAssignedTeam(crimeId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/collect/assignedteam/${crimeId}`, {withCredentials: true});
  }

  // POST Method
  establishCase(crimeData: any): Observable<any> {
    return this.http.post(this.baseUrl, crimeData, {withCredentials: true});
  }

  // PUT Methods
  endorseCase(crimeId: number, policeId: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/endorse/case/${crimeId}/${policeId}`, {withCredentials: true});
  }

  endorseCaseMany(crimeId: number, policeIds: number[]): Observable<any> {
    return this.http.put(`${this.baseUrl}/endorse/case/many/${crimeId}`, policeIds, {withCredentials: true});
  }

  connectVictim(crimeId: number, victimId: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/establish/victim/${crimeId}/${victimId}`, {withCredentials: true});
  }

  markSolved(crimeId: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/mark/solved/${crimeId}`, {withCredentials: true});
  }

  updateCase(crimeId: number, crimeData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/up/${crimeId}`, crimeData, {withCredentials: true});
  }



  // // Interface for type safety
  // interface CrimeRequestDto {
  //   police_id_list?: number[];
  //   victim_id_list?: number[];
  //   suspect_id_list?: number[];
  //   // Add other properties based on your backend DTO
  // }
}