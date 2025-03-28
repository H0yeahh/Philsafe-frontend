import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from './environment';

export interface IPolice {
  police_id: number;
  unit: string;
  role: string;
  badge_number: number;
  debut_date: string;
  station_id: number;
  person_id: number;
  rank_id: number;
  rank_full: string;
  rank_abbr: string;
  firstname: string;
  middlename: string;
  lastname: string;
  created_by: string;
  datetime_created: string;
}


@Injectable({
  providedIn: 'root'
})
export class PoliceOfficerService {
  private base = `${environment.ipAddUrl}`;
  

  constructor(private http: HttpClient) { }

  create(data: IPolice): Observable<any> {
    const url = `${this.base}/api/police`;
    return this.http.post(url, data).pipe(
      catchError(this.handleError)
    );
  }

  getAll(): Observable<any> {
    const url = `${this.base}/api/police/collect/all`;
    return this.http.get(url).pipe(
      catchError(this.handleError)
    );
  }

  // Delete station method
  delete(policeId: number): Observable<any> {
    const url = `${this.base}/api/police/resign/{id}`;
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
