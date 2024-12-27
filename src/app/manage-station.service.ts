import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from './environment';

export interface IStation {
  station_id: number;
  hq: string;
  location_id?: number;
  abbr: string;
  rank: string;
  officer_in_charge_id: number;
  province: string;
  municipality: string;
  street: string;
  region: string;
  barangay: string;
  is_approved: string;
  supervising_id: string;
}

@Injectable({
  providedIn: 'root'
})
export class ManageStationService {
  private apiUrl = `${environment.ipAddUrl}`;

  // API endpoints
  private endpoints = {
    station: `${this.apiUrl}api/jurisdiction/collect`,
    localStations: (stationId: number) => `${this.apiUrl}api/jurisdiction/retrieve/${stationId}`,
    submitStation: `${this.apiUrl}api/jurisdiction`,
    updateStation: (id: number) => `${this.apiUrl}api/jurisdiction/up/${id}`,
    deleteStation: (id: number) => `${this.apiUrl}api/jurisdiction/discard/${id}`,
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
  getStations(): Observable<IStation[]> {
    const headers = this.getHeaders();
    return this.http.get<IStation[]>(this.endpoints.station, { headers })
      .pipe(catchError(this.handleError));
  }

  // Fetch a specific station by station ID
  getLocalStation(stationID: number): Observable<IStation[]> {
    const headers = this.getHeaders();
    return this.http.get<IStation[]>(this.endpoints.localStations(stationID), { headers })
      .pipe(catchError(this.handleError));
  }

  // Submit a new station
  submitStation(station: IStation): Observable<IStation> {
    const headers = this.getHeaders();
    return this.http.post<IStation>(this.endpoints.submitStation, station, { headers })
      .pipe(catchError(this.handleError));
  }

  // Update an existing station
  editStation(stationID: number, updatedStation: IStation): Observable<IStation> {
    const headers = this.getHeaders();
    return this.http.put<IStation>(this.endpoints.updateStation(stationID), updatedStation, { headers })
      .pipe(catchError(this.handleError));
  }

  // Delete a station by ID
  // deleteStation(stationID: number): Observable<void> {
  //   const headers = this.getHeaders();
  //   return this.http.delete<void>(this.endpoints.deleteStation(stationID), { headers })
  //     .pipe(catchError(this.handleError));
  // }

  deleteStation(stationID: number): Observable<void> {
    if (!stationID || typeof stationID !== 'number') {
      return throwError(() => ({
        message: 'Invalid station ID provided for deletion.',
      }));
    }
  
    const headers = this.getHeaders();
    return this.http.delete<void>(this.endpoints.deleteStation(stationID), { headers })
      .pipe(catchError(this.handleError));
  }
  

  // Search stations based on a query string
  searchStation(query: string): Observable<IStation[]> {
    const headers = this.getHeaders();
    return this.http.get<IStation[]>(this.endpoints.searchStation(query), { headers })
      .pipe(catchError(this.handleError));
  }

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
