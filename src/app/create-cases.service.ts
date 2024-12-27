import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from './environment';

export interface ICase {
  title: string;
  offenseType: string;
  citeNumber: string;
  datetimeReported: string;
  datetimeCommitted: string;
  description: string;
  status: string;
  incidenttypeId: number;
  datetimeCreated: string;
  lastModified: string;
  createdBy: string;
  modifiedBy: string;
  locationId: number;
  stationId?: number;
  victim_id_list?: number;
  suspect_id_list?: number;
  police_id_list?: number;
}

@Injectable({
  providedIn: 'root'
})
export class CreateCasesService {
  private apiUrl = `${environment.ipAddUrl}`; // Base API URL

  // API endpoints
  private endpoints = {
    case: `${this.apiUrl}/api/case`,
    localCase: (stationId: number) => `${this.apiUrl}/api/case/retrieve/local/${stationId}`,
    nationwideCase: `${this.apiUrl}/api/case/retrieve/nationwide`,
    loadIncidentTypes: `${this.apiUrl}/api/case/retrieve/incidenttypes`,
    retrieveSuspect: (suspectId: number) => `${this.apiUrl}/api/case/retrieve/suspect/${suspectId}`,
    retrieveSpecificCase: (crimeId: number) => `${this.apiUrl}/api/case/retrieve/${crimeId}`,
    retrieveOngoing: (stationId: number) => `${this.apiUrl}/api/case/retrieve/ongoing/${stationId}`,
    retrieveOngoingCount: (stationId: number) => `${this.apiUrl}/api/case/retrieve/count/${stationId}`,
    retrieveSolved: (stationId: number) => `${this.apiUrl}/api/case/retrieve/solved/${stationId}`,
    retrieveCollect: (crimeId: number) => `${this.apiUrl}/api/case/collect/assignedteam/${crimeId}`,
    moveToEndorsedQueue: (reportId: number) => `${this.apiUrl}/api/report/endorse/${reportId}`,
    getCitizens: `${this.apiUrl}/api/citizens`,
    getReport: (citizenID: number) => `${this.apiUrl}/api/report/${citizenID}`,
    dismissReport: (reportId: number) => `${this.apiUrl}/api/report/dismiss/${reportId}`
  };

  constructor(private http: HttpClient) {}

  // Helper function to get the session token
  private getSessionToken(): string | null {
    return localStorage.getItem('session_token'); // Replace with your token key
  }

  // Helper function to get the headers with session token
  private getHeaders(): HttpHeaders {
    const sessionToken = this.getSessionToken();
    return new HttpHeaders({
      'Authorization': sessionToken ? `Bearer ${sessionToken}` : ''
    });
  }

  // Fetch reports for a specific station
  getCase(stationId: number): Observable<ICase[]> {
    const headers = this.getHeaders();
    return this.http.get<ICase[]>(this.endpoints.localCase(stationId), { headers })
      .pipe(catchError(this.handleError));
  }

  // Fetch all nationwide reports
  getNationwideCase(): Observable<ICase[]> {
    const headers = this.getHeaders();
    return this.http.get<ICase[]>(this.endpoints.nationwideCase, { headers })
      .pipe(catchError(this.handleError));
  }

  // Submit a new report
  submitCase(cases: ICase): Observable<ICase> {
    const headers = this.getHeaders();
    return this.http.post<ICase>(this.endpoints.case, cases, { headers })
      .pipe(catchError(this.handleError));
  }

  // Fetch reports by suspect ID
  retrieveSuspect(suspectId: number): Observable<ICase[]> {
    const headers = this.getHeaders();
    return this.http.get<ICase[]>(this.endpoints.retrieveSuspect(suspectId), { headers })
      .pipe(catchError(this.handleError));
  }

  // Fetch specific case by crime ID
  retrieveSpecificCase(crimeId: number): Observable<ICase> {
    const headers = this.getHeaders();
    return this.http.get<ICase>(this.endpoints.retrieveSpecificCase(crimeId), { headers })
      .pipe(catchError(this.handleError));
  }

  // Fetch ongoing cases for a station
  retrieveOngoing(stationId: number): Observable<ICase[]> {
    const headers = this.getHeaders();
    return this.http.get<ICase[]>(this.endpoints.retrieveOngoing(stationId), { headers })
      .pipe(catchError(this.handleError));
  }

  // Fetch count of ongoing cases for a station
  retrieveOngoingCount(stationId: number): Observable<number> {
    const headers = this.getHeaders();
    return this.http.get<number>(this.endpoints.retrieveOngoingCount(stationId), { headers })
      .pipe(catchError(this.handleError));
  }

  // Fetch solved cases for a station
  retrieveSolved(stationId: number): Observable<ICase[]> {
    const headers = this.getHeaders();
    return this.http.get<ICase[]>(this.endpoints.retrieveSolved(stationId), { headers })
      .pipe(catchError(this.handleError));
  }

  // Move a report to the endorsed queue
  moveToEndorsedQueue(reportId: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post<any>(this.endpoints.moveToEndorsedQueue(reportId), {}, { headers })
      .pipe(catchError(this.handleError));
  }

  // Fetch citizens
  getCitizens(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get<any>(this.endpoints.getCitizens, { headers })
      .pipe(catchError(this.handleError));
  }

  // Fetch a specific report by citizen ID
  // fetchReport(citizenID: number): Observable<any> {
  //   const headers = this.getHeaders();
  //   return this.http.get<any>(this.endpoints.getReport(citizenID), { headers })
  //     .pipe(catchError(this.handleError));
  // }

  // // Dismiss a report
  // dismissReport(reportId: number): Observable<any> {
  //   const headers = this.getHeaders();
  //   return this.http.post<any>(this.endpoints.dismissReport(reportId), {}, { headers })
  //     .pipe(catchError(this.handleError));
  // }

  // Error handling function
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.status === 400 && error.error.errors) {
        const validationErrors = error.error.errors;
        errorMessage = this.formatValidationErrors(validationErrors);
      } else {
        errorMessage = `Server-side error: ${error.status}, message: ${error.message}`;
      }
    }

    console.error('Full error details:', error);

    return throwError({
      message: errorMessage,
      status: error.status,
      error: error.error
    });
  }

  // Helper function to format validation errors
  private formatValidationErrors(errors: any): string {
    let formattedErrors = 'Validation errors:\n';
    for (const key in errors) {
      if (errors.hasOwnProperty(key)) {
        formattedErrors += `${key}: ${errors[key].join(', ')}\n`;
      }
    }
    return formattedErrors;
  }
}
