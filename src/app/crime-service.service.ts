import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './environment';


@Injectable({
  providedIn: 'root'
})
export class CrimeService {
  private baseUrl = `${environment.ipAddUrl}api/case`;

  constructor(private http: HttpClient) {}

  // GET Methods
  getNationwideCases(): Observable<any> {
    return this.http.get(`${this.baseUrl}/retrieve/nationwide`);
  }

  getIncidentTypes(): Observable<any> {
    return this.http.get(`${this.baseUrl}/load/incidenttypes`);
  }

  getLocalCases(stationId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/retrieve/local/${stationId}`);
  }

  getInvolvedCases(suspectId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/retrieve/suspect/${suspectId}`);
  }

  getSpecificCase(crimeId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/retrieve/specific/${crimeId}`);
  }

  getFurtherCase(crimeId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/retrieve/further/${crimeId}`);
  }

  getOngoingCases(stationId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/retrieve/ongoing/${stationId}`);
  }

  getOngoingCasesCount(stationId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/retrieve/ongoing/count/${stationId}`);
  }

  getSolvedCases(stationId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/retrieve/solved/${stationId}`);
  }

  getAssignedTeam(crimeId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/collect/assignedteam/${crimeId}`);
  }

  // POST Method
  establishCase(crimeData: any): Observable<any> {
    return this.http.post(this.baseUrl, crimeData);
  }

  // PUT Methods
  endorseCase(crimeId: number, policeId: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/endorse/case/${crimeId}/${policeId}`, {});
  }

  endorseCaseMany(crimeId: number, policeIds: number[]): Observable<any> {
    return this.http.put(`${this.baseUrl}/endorse/case/many/${crimeId}`, policeIds);
  }

  connectVictim(crimeId: number, victimId: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/establish/victim/${crimeId}/${victimId}`, {});
  }

  markSolved(crimeId: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/mark/solved/${crimeId}`, {});
  }

  updateCase(crimeId: number, crimeData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/up/${crimeId}`, crimeData);
  }



  // // Interface for type safety
  // interface CrimeRequestDto {
  //   police_id_list?: number[];
  //   victim_id_list?: number[];
  //   suspect_id_list?: number[];
  //   // Add other properties based on your backend DTO
  // }
}