import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
// import { ICitizen } from './police-accounts.service';


export interface ICitizen {
  citizen_id: string;
  person_id: string;
  is_certified: boolean;
  firstname : string;
  middlename: string;
  lastname: string;
  sex: string;
  birthdate: string;
  civil_status: string;
  bio_status: string;
  location_id: number;
}


@Injectable({
  providedIn: 'root'
})
export class ManageUsersService  {
  private apiUrl = 'https://localhost:7108/';

  // API endpoints
  private endpoints = {
    citizen: `${this.apiUrl}api/citizen/collect/citizens/all`,
    citizenVerification: (person_id: number) => `${this.apiUrl}api/citizen/verify/${person_id}`,
    submitCitizen: `${this.apiUrl}api/citizen`,
    updateStation: (stationId: number) => `${this.apiUrl}api/jurisdiction/${stationId}`,
    deleteStation: (stationId: number) => `${this.apiUrl}api/jurisdiction/${stationId}`,
    searchStation: (query: string) => `${this.apiUrl}api/jurisdiction/search?query=${query}`
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
  getCitizens(): Observable<ICitizen[]> {
    const headers = this.getHeaders();
    return this.http.get<ICitizen[]>(this.endpoints.citizen, { headers })
      .pipe(catchError(this.handleError));
  }

  // Fetch a specific station by station ID
  getCitizenVerification(person_id: number): Observable<ICitizen[]> {
    const headers = this.getHeaders();
    return this.http.get<ICitizen[]>(this.endpoints.citizenVerification(person_id), { headers })
      .pipe(catchError(this.handleError));
  }

  // Submit a new station
  submitCitizen(citizen: ICitizen): Observable<ICitizen> {
    const headers = this.getHeaders();
    return this.http.post<ICitizen>(this.endpoints.submitCitizen, citizen, { headers })
      .pipe(catchError(this.handleError));
  }

  // Update an existing station
  editCitizen(person_id: number, updatedCitizen: ICitizen): Observable<ICitizen> {
    const headers = this.getHeaders();
    return this.http.put<ICitizen>(this.endpoints.updateStation(person_id), updatedCitizen, { headers })
      .pipe(catchError(this.handleError));
  }

  // Delete a station by ID
  deleteCitizen(citizenId: number): Observable<void> {
    const headers = this.getHeaders();
    return this.http.delete<void>(this.endpoints.deleteStation(citizenId), { headers })
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
