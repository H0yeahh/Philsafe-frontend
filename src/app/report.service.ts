import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from './environment';

export interface IReport {
  message: string;
  code: number;
}



@Injectable({
  providedIn: 'root'
})
export class ReportService {

  getReports() {
    throw new Error('Method not implemented.');
  }
  private base = `${environment.ipAddUrl}`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<any> {
    const url = `${this.base}/api/report/retrieve/citizen`;
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
