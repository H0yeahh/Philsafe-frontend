import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './environment';



export interface SuspectFully {

  personId: number;
  gang?: string;
  reward: string;
  isCaught: boolean;
  dateCaught?: string;
  firstName: string;
  middleName: string;
  lastName: string;
  gender: string;
  birthDate: string;
  civilStatus: string;
  motiveShort?: string;
  motiveLong?: string;
  deathDate?: string;
  mugshots?: Uint8Array;
}

@Injectable({
  providedIn: 'root'
})
export class SuspectServiceService {
  private baseUrl = `${environment.ipAddUrl}api/suspect`;

  constructor(private http: HttpClient) {}



  retrieveReportedSus(reportId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/fromreport/${reportId}`);
  }



  retrieveAllSuspects(): Observable<any> {
    return this.http.get(`${this.baseUrl}/collect/all`);
  }


  retrieveAllPrisoners(): Observable<any> {
    return this.http.get(`${this.baseUrl}/collect/prison`);
  }


  retrieveAllWanteds(): Observable<any> {
    return this.http.get(`${this.baseUrl}/collect/freedom`);
  }

  identifyCriminal(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/verify/${id}`);
  }


  establishCriminal(suspect: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, suspect);
  }

  establishCriminalFully(suspect: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/identify/suspect/fully`, suspect);
  }

  connectToCrime(request: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/connect/specific`, request);
  }

 
  editCriminal(id: number, suspect: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/edit/${id}`, suspect);
  }

 
  clearName(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/discard/${id}`);
  }
}
