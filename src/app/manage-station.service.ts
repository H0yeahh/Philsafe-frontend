// import { Injectable } from '@angular/core';
// import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
// import { Observable, throwError } from 'rxjs';
// import { catchError } from 'rxjs/operators';


// export interface IStation {

//     station_id: number;
//     hq: string;
//     location_id?: number;
//     abbr: string;
//     rank: string;
//     officer_in_charge_id: number;
//     province: string;
//     municipality: string;
//     street: string;
//     region: string;
//     barangay: string;
//     is_approved: string;
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class ManageStationService {
//   private apiUrl = 'https://localhost:7108';  // Base API URL

//   // API endpoints
//   private endpoints = {
//     station: `${this.apiUrl}api/jurisdiction/collect`,
//     localStations: (stationId: number) => `${this.apiUrl}/api/jurisdiction/retrieve/${stationId}`,
//     submitStation: `${this.apiUrl}/api/jurisdiction`,
//   };

//   constructor(private http: HttpClient) {}

//   // Helper function to get the session token
//   private getSessionToken(): string | null {
//     return localStorage.getItem('session_token');  // Replace with your token key
//   }

//   // Helper function to get the headers with session token
//   private getHeaders(): HttpHeaders {
//     const sessionToken = this.getSessionToken();
//     return new HttpHeaders({
//       'Authorization': sessionToken ? `Bearer ${sessionToken}` : ''
//     });
//   }

//   // Fetch reports for a specific station
//   getStation(stationId: number): Observable<IStation[]> {
//     const headers = this.getHeaders();
//     return this.http.get<IStation[]>(this.endpoints.station, { headers })
//       .pipe(catchError(this.handleError));
//   }

//   getStations(stationId: number): Observable<IStation[]> {
//     const headers = this.getHeaders();
//     return this.http.get<IStation[]>(this.endpoints.localStations(stationId), { headers })
//       .pipe(catchError(this.handleError));
//   }


//   // Submit a new report
//   submitStation(station: IStation): Observable<IStation> {
//     const headers = this.getHeaders();
//     return this.http.post<IStation>(this.endpoints.submitStation, station, { headers })
//       .pipe(catchError(this.handleError));
//   }

//   // Error handling function
//   private handleError(error: HttpErrorResponse): Observable<never> {
//     let errorMessage = 'An unknown error occurred!';

//     if (error.error instanceof ErrorEvent) {
//       // Client-side error
//       errorMessage = `Client-side error: ${error.error.message}`;
//     } else {
//       // Server-side error
//       if (error.status === 400 && error.error.errors) {
//         const validationErrors = error.error.errors;
//         errorMessage = this.formatValidationErrors(validationErrors);
//       } else {
//         errorMessage = `Server-side error: ${error.status}, message: ${error.message}, response: ${error.error ? JSON.stringify(error.error) : 'N/A'}`;
//       }
//     }

//     // Log the full error for debugging
//     console.error('Full error details:', error);

//     return throwError({
//       message: errorMessage,
//       status: error.status,
//       error: error.error,
//     });
//   }

//   // Helper function to format validation errors
//   private formatValidationErrors(errors: any): string {
//     let formattedErrors = 'Validation errors:\n';
//     for (const key in errors) {
//       if (errors.hasOwnProperty(key)) {
//         formattedErrors += `${key}: ${errors[key].join(', ')}\n`;
//       }
//     }
//     return formattedErrors;
//   }
// }

// import { Injectable } from '@angular/core';
// import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
// import { Observable, throwError } from 'rxjs';
// import { catchError } from 'rxjs/operators';

// export interface IStation {
//   station_id: number;
//   hq: string;
//   location_id?: number;
//   abbr: string;
//   rank: string;
//   officer_in_charge_id: number;
//   province: string;
//   municipality: string;
//   street: string;
//   region: string;
//   barangay: string;
//   is_approved: string;
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class ManageStationService {
//   private apiUrl = 'https://localhost:7108/';  // Ensure trailing slash for base API URL

//   // API endpoints
//   private endpoints = {
//     station: `${this.apiUrl}api/jurisdiction/collect`,
//     localStations: (stationId: number) => `${this.apiUrl}api/jurisdiction/retrieve/${stationId}`,
//     submitStation: `${this.apiUrl}api/jurisdiction`,
//   };

//   constructor(private http: HttpClient) {}

//   // Helper function to get the session token
//   private getSessionToken(): string | null {
//     return localStorage.getItem('session_token');  // Replace with your token key
//   }

//   // Helper function to get the headers with session token
//   private getHeaders(): HttpHeaders {
//     const sessionToken = this.getSessionToken();
//     return new HttpHeaders({
//       'Authorization': sessionToken ? `Bearer ${sessionToken}` : ''
//     });
//   }

//   // Fetch all stations
//   getStations(): Observable<IStation[]> {
//     const headers = this.getHeaders();
//     return this.http.get<IStation[]>(this.endpoints.station, { headers })
//       .pipe(catchError(this.handleError));
//   }

//   // Fetch reports for a specific station
//   getLocalStation(stationId: number): Observable<IStation[]> {
//     const headers = this.getHeaders();
//     return this.http.get<IStation[]>(this.endpoints.localStations(stationId), { headers })
//       .pipe(catchError(this.handleError));
//   }

//   // Submit a new station report
//   submitStation(station: IStation): Observable<IStation> {
//     const headers = this.getHeaders();
//     return this.http.post<IStation>(this.endpoints.submitStation, station, { headers })
//       .pipe(catchError(this.handleError));
//   }

//   // Error handling function
//   private handleError(error: HttpErrorResponse): Observable<never> {
//     let errorMessage = 'An unknown error occurred!';

//     if (error.error instanceof ErrorEvent) {
//       // Client-side error
//       errorMessage = `Client-side error: ${error.error.message}`;
//     } else {
//       // Server-side error
//       if (error.status === 400 && error.error.errors) {
//         const validationErrors = error.error.errors;
//         errorMessage = this.formatValidationErrors(validationErrors);
//       } else {
//         errorMessage = `Server-side error: ${error.status}, message: ${error.message}, response: ${error.error ? JSON.stringify(error.error) : 'N/A'}`;
//       }
//     }

//     // Log the full error for debugging
//     console.error('Full error details:', error);

//     return throwError({
//       message: errorMessage,
//       status: error.status,
//       error: error.error,
//     });
//   }

//   // Helper function to format validation errors
//   private formatValidationErrors(errors: any): string {
//     let formattedErrors = 'Validation errors:\n';
//     for (const key in errors) {
//       if (errors.hasOwnProperty(key)) {
//         formattedErrors += `${key}: ${errors[key].join(', ')}\n`;
//       }
//     }
//     return formattedErrors;
//   }
// }


// import { Injectable } from '@angular/core';
// import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
// import { Observable, throwError } from 'rxjs';
// import { catchError } from 'rxjs/operators';

// export interface IStation {
//   station_id: number;
//   hq: string;
//   location_id?: number;
//   abbr: string;
//   rank: string;
//   officer_in_charge_id: number;
//   province: string;
//   municipality: string;
//   street: string;
//   region: string;
//   barangay: string;
//   is_approved: string;
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class ManageStationService {
//   private apiUrl = 'https://localhost:7108/';

//   // API endpoints
//   private endpoints = {
//     station: `${this.apiUrl}api/jurisdiction/collect`,
//     localStations: (stationId: number) => `${this.apiUrl}api/jurisdiction/retrieve/${stationId}`,
//     submitStation: `${this.apiUrl}api/jurisdiction`,
//     updateStation: (stationId: number) => `${this.apiUrl}api/jurisdiction/${stationId}`,
//     deleteStation: (stationId: number) => `${this.apiUrl}api/jurisdiction/${stationId}`,
//     searchStation: (query: string) => `${this.apiUrl}api/jurisdiction/search?query=${query}`
//   };

//   constructor(private http: HttpClient) {}

//   private getSessionToken(): string | null {
//     return localStorage.getItem('session_token');
//   }

//   private getHeaders(): HttpHeaders {
//     const sessionToken = this.getSessionToken();
//     return new HttpHeaders({
//       'Authorization': sessionToken ? `Bearer ${sessionToken}` : ''
//     });
//   }

//   // Fetch all stations
//   getStations(): Observable<IStation[]> {
//     const headers = this.getHeaders();
//     return this.http.get<IStation[]>(this.endpoints.station, { headers })
//       .pipe(catchError(this.handleError));
//   }

//   // Fetch a specific station by station ID
//   getLocalStation(stationId: number): Observable<IStation[]> {
//     const headers = this.getHeaders();
//     return this.http.get<IStation[]>(this.endpoints.localStations(stationId), { headers })
//       .pipe(catchError(this.handleError));
//   }

//   // Submit a new station
//   submitStation(station: IStation): Observable<IStation> {
//     const headers = this.getHeaders();
//     return this.http.post<IStation>(this.endpoints.submitStation, station, { headers })
//       .pipe(catchError(this.handleError));
//   }

//   // Update an existing station
//   editStation(stationId: number, updatedStation: IStation): Observable<IStation> {
//     const headers = this.getHeaders();
//     return this.http.put<IStation>(this.endpoints.updateStation(stationId), updatedStation, { headers })
//       .pipe(catchError(this.handleError));
//   }

//   // Delete a station by ID
//   deleteStation(stationId: number): Observable<void> {
//     const headers = this.getHeaders();
//     return this.http.delete<void>(this.endpoints.deleteStation(stationId), { headers })
//       .pipe(catchError(this.handleError));
//   }
  

//   // Search stations based on a query string
//   searchStation(query: string): Observable<IStation[]> {
//     const headers = this.getHeaders();
//     return this.http.get<IStation[]>(this.endpoints.searchStation(query), { headers })
//       .pipe(catchError(this.handleError));
//   }

//   // Error handling function
//   private handleError(error: HttpErrorResponse): Observable<never> {
//     let errorMessage = 'An unknown error occurred!';
//     if (error.error instanceof ErrorEvent) {
//       errorMessage = `Client-side error: ${error.error.message}`;
//     } else {
//       if (error.status === 400 && error.error.errors) {
//         const validationErrors = error.error.errors;
//         errorMessage = this.formatValidationErrors(validationErrors);
//       } else {
//         errorMessage = `Server-side error: ${error.status}, message: ${error.message}, response: ${error.error ? JSON.stringify(error.error) : 'N/A'}`;
//       }
//     }
//     console.error('Full error details:', error);
//     return throwError({
//       message: errorMessage,
//       status: error.status,
//       error: error.error,
//     });
//   }

//   // Helper function to format validation errors
//   private formatValidationErrors(errors: any): string {
//     let formattedErrors = 'Validation errors:\n';
//     for (const key in errors) {
//       if (errors.hasOwnProperty(key)) {
//         formattedErrors += `${key}: ${errors[key].join(', ')}\n`;
//       }
//     }
//     return formattedErrors;
//   }
// }


import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

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
  private apiUrl = 'https://localhost:7108/';

  // API endpoints
  private endpoints = {
    station: `${this.apiUrl}api/jurisdiction/collect`,
    localStations: (stationId: number) => `${this.apiUrl}api/jurisdiction/retrieve/${stationId}`,
    submitStation: `${this.apiUrl}api/jurisdiction`,
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
  getStations(): Observable<IStation[]> {
    const headers = this.getHeaders();
    return this.http.get<IStation[]>(this.endpoints.station, { headers })
      .pipe(catchError(this.handleError));
  }

  // Fetch a specific station by station ID
  getLocalStation(stationId: number): Observable<IStation[]> {
    const headers = this.getHeaders();
    return this.http.get<IStation[]>(this.endpoints.localStations(stationId), { headers })
      .pipe(catchError(this.handleError));
  }

  // Submit a new station
  submitStation(station: IStation): Observable<IStation> {
    const headers = this.getHeaders();
    return this.http.post<IStation>(this.endpoints.submitStation, station, { headers })
      .pipe(catchError(this.handleError));
  }

  // Update an existing station
  editStation(stationId: number, updatedStation: IStation): Observable<IStation> {
    const headers = this.getHeaders();
    return this.http.put<IStation>(this.endpoints.updateStation(stationId), updatedStation, { headers })
      .pipe(catchError(this.handleError));
  }

  // Delete a station by ID
  deleteStation(stationId: number): Observable<void> {
    const headers = this.getHeaders();
    return this.http.delete<void>(this.endpoints.deleteStation(stationId), { headers })
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
