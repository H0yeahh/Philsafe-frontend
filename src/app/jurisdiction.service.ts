import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from './environment';


export interface ICreateParam {
  hq: string;
  locationId: number;
  isApproved: boolean;
  abbr: string;
  rank: string;
  officerInChargeId: number;
}

export interface IStation {
  station_id: number;
  hq: string;
  location_id: number;
  abbr: string;
  rank: string;
  province: string;
  municipality: string;
  street: string;
  region: string;
  barangay: string;
  is_approved: boolean;
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

// @Injectable({
//   providedIn: 'root'
// })
// export class JurisdictionService {
//   private base = 'https://localhost:7108';

//   constructor(private http: HttpClient) { }

//   create(data: ICreateParam): Observable<any> {
//     const url = `${this.base}/api/jurisdiction`;
//     return this.http.post(url, data).pipe(
//       catchError(this.handleError)
//     );
//   }

//   getAll(): Observable<any> {
//     const url = `${this.base}/api/jurisdiction/collect`;
//     return this.http.get(url).pipe(
//       catchError(this.handleError)
//     );
//   }

//   private handleError(error: HttpErrorResponse) {
//     let errorMessage = 'Unknown error!';
//     if (error.error instanceof ErrorEvent) {
//       errorMessage = `Error: ${error.error.message}`;
//     } else {
//       errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
//     }
//     return throwError(errorMessage);
//   }
// }

@Injectable({
  providedIn: 'root'
})
export class JurisdictionService {
  private base = `${environment.ipAddUrl}`;

  constructor(private http: HttpClient) { }

  create(data: ICreateParam): Observable<any> {
    const url = `${this.base}/api/jurisdiction`;
    return this.http.post(url, data).pipe(
      catchError(this.handleError)
    );
  }

  getAll(): Observable<any> {
    const url = `${this.base}/api/jurisdiction/collect`;
    return this.http.get(url).pipe(
      catchError(this.handleError)
    );
  }

  // Delete station method
  delete(stationId: number): Observable<any> {
    const url = `${this.base}/api/jurisdiction/discard/{StationId}`;
    return this.http.delete(url).pipe(
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
