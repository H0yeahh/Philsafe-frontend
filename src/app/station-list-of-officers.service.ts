import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
// import { ICitizen } from './police-accounts.service';


export interface IPolice {
  unit: string;
  role: string;
  badgeNumber: string;
  debutDate: string;
  stationID?: number;
  personID?: number;
  pfpId?: number;
  rankID?: number;
  createdBy: string;
  datetimeCreated: string;
}


@Injectable({
  providedIn: 'root'
})
export class StationListOfOfficersService  {
  private apiUrl = 'https://localhost:7108/';

  // API endpoints
  private endpoints = {
    police: `${this.apiUrl}api/police/retrieve/collect/all`,
    policeVerification: (person_id: number) => `${this.apiUrl}api/police/verify/${person_id}`,
    submitPolice: `${this.apiUrl}api/police`,
    updatePolice: (id: number) => `${this.apiUrl}api/police/update${id}`,
    deletePolice: (id: number) => `${this.apiUrl}api/police/resign${id}`,
    searchPolice: (query: string) => `${this.apiUrl}api/police/search?query=${query}`
  };

  constructor(private http: HttpClient) {}

  private getSessionToken(): string | null {
    return localStorage.getItem('session_token');
  }

  private getHeaders(): HttpHeaders {
    const sessionToken = this.getSessionToken();
    return new HttpHeaders({
      'Authorization': sessionToken ? `Bearer ${sessionToken}` : '',
      'Content-Type': 'application/json'  // Ensure JSON format for requests
    });
  }

  // Fetch all stations
  getPolice(): Observable<IPolice[]> {
    const headers = this.getHeaders();
    return this.http.get<IPolice[]>(this.endpoints.police, { headers })
      .pipe(catchError(this.handleError));
  }

  // Fetch a specific station by station ID
  getPoliceVerification(person_id: number): Observable<IPolice[]> {
    const headers = this.getHeaders();
    return this.http.get<IPolice[]>(this.endpoints.policeVerification(person_id), { headers })
      .pipe(catchError(this.handleError));
  }

  // Submit a new station
  submitPolice(police: IPolice): Observable<IPolice> {
    const headers = this.getHeaders();
    return this.http.post<IPolice>(this.endpoints.submitPolice, police, { headers })
      .pipe(catchError(this.handleError));
  }

  // Update an existing station
  editPolice(person_id: number, updatedPolice: IPolice): Observable<IPolice> {
    const headers = this.getHeaders();
    return this.http.put<IPolice>(this.endpoints.updatePolice(person_id), updatedPolice, { headers })
      .pipe(catchError(this.handleError));
  }

  // Delete a station by ID
  deletePolice(person_Id: number): Observable<void> {
    const headers = this.getHeaders();
    return this.http.delete<void>(this.endpoints.deletePolice(person_Id), { headers })
      .pipe(catchError(this.handleError));
  }

  // Search stations based on a query string
  // searchStation(query: string): Observable<IStation[]> {
  //   const headers = this.getHeaders();
  //   return this.http.get<IStation[]>(this.endpoints.searchStation(query), { headers })
  //     .pipe(catchError(this.handleError));
  // }

  // Error handling function
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      if (error.status === 400 && error.error.errors) {
        const validationErrors = error.error.errors;
        errorMessage = this.formatValidationErrors(validationErrors);
      } else {
        errorMessage = `Server-side error: ${error.status}, message: ${error.message}, response: ${error.error ? JSON.stringify(error.error) : 'N/A'}`;
      }
    }
    console.error('Full error details:', error);
    return throwError({
      message: errorMessage,
      status: error.status,
      error: error.error,
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
