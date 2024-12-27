import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from './environment';



export interface IRank {
    rank_id: number,
    rank_abbr: string ,
    rank_full: string
}

export interface IPolice {
  unit: string;
  role: string;
  badgeNumber: string;
  debutDate: string;
  stationId?: number;
  personId?: number;
  pfpId?: number;
  rankId?: number;
  createdBy: string;
  datetimeCreated: string;
}

export interface IAccount {
  firstname: string;
  middlename: string;
  lastname: string;
  sex: string;
  birthdate: string;
  civilStatus: string;
  bioStatus: boolean;
  email: string;
  telNum?: string;
  password: string;
  contactNum: string;
  homeAddressId: number;
  workAddressId: number;
  personId: number;
  role: string;
  profilePic?: string
}


export interface IPerson {
  person_id?: number;
  firstname: string;
  middlename: string;
  lastname: string;
  sex: string;
  birthdate: string;
  civilStatus: string;
  bioStatus: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PoliceService {
  getPersons() {
    throw new Error('Method not implemented.');
  }
  private base = `${environment.ipAddUrl}`;

  constructor(private http: HttpClient) { }

  create(data: IPolice): Observable<any> {
    const url = `${this.base}/api/person`;
    return this.http.post(url, data).pipe(
      catchError(this.handleError)
    );
  }

  getAll(): Observable<any> {
    const url = `${this.base}/api/person/retrieve/all`;
    return this.http.get(url).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }
}







