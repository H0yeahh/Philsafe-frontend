import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
   private token = localStorage.getItem('token') ?? '';
    private auth_token = new HttpHeaders({
      
        'Authorization': this.token
      });

  constructor(private http: HttpClient) {}



  retrieveReportedSus(reportId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/fromreport/${reportId}` , {headers: this.auth_token});
  }



  retrieveAllSuspects(): Observable<any> {
    return this.http.get(`${this.baseUrl}/collect/all` , {headers: this.auth_token});
  }


  retrieveAllPrisoners(): Observable<any> {
    return this.http.get(`${this.baseUrl}/collect/prison` , {headers: this.auth_token});
  }


  retrieveAllWanteds(): Observable<any> {
    return this.http.get(`${this.baseUrl}/collect/freedom` , {headers: this.auth_token});
  }

  identifyCriminal(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/verify/${id}` , {headers: this.auth_token});
  }


  establishCriminal(suspect: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, suspect , {headers: this.auth_token});
  }

  establishCriminalFully(suspect: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/identify/suspect/fully`, suspect , {headers: this.auth_token});
  }

  connectToCrime(request: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/connect/specific`, request , {headers: this.auth_token});
  }

 
  editCriminal(id: number, suspect: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/edit/${id}`, suspect , {headers: this.auth_token});
  }

 
  clearName(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/discard/${id}` , {headers: this.auth_token});
  }

  getDescription(id: number): Observable<any> {

    const url = `${environment.ipAddUrl}api/description/suspect/${id}`;
    return this.http.get( url , {headers: this.auth_token});
  }

  getReportedDescription(id: number): Observable<any> {

    const url = `${environment.ipAddUrl}api/description/report/${id}`;
    return this.http.get( url , {headers: this.auth_token});
  }
}
