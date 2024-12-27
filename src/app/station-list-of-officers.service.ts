// import { Injectable } from '@angular/core';
// import {
//   HttpClient,
//   HttpErrorResponse,
//   HttpHeaders,
// } from '@angular/common/http';
// import { Observable, throwError } from 'rxjs';
// import { catchError } from 'rxjs/operators';
// import { ICitizen } from './police-accounts.service';

// export interface IPolice {
//   police_id: number;
//   unit: string;
//   role: string;
//   badge_number: number;
//   debut_date: string;
//   station_id: number;
//   person_id: number;
//   rank_id: number;
//   rank_full: string;
//   rank_abbr: string;
//   firstname: string;
//   middlename: string;
//   lastname: string;
//   created_by: string;
//   datetime_created: string;
// }

// @Injectable({
//   providedIn: 'root',
// })
// export class StationListOfOfficersService {
  // private apiUrl = 'https://localhost:7108/';

  // // API endpoints
  // private endpoints = {
  //   police: `${this.apiUrl}api/police/retrieve/collect/all`,
  //   policeVerification: (personId: number) =>
  //     `${this.apiUrl}api/police/check/${personId}`,
  //   submitPolice: `${this.apiUrl}api/police`,
  //   updatePolice: (id: number) => `${this.apiUrl}api/police/update${id}`,
  //   deletePolice: (id: number) => `${this.apiUrl}api/police/resign${id}`,
  //   searchPolice: (query: string) =>
  //     `${this.apiUrl}api/police/search?query=${query}`,
  // };

  // constructor(private http: HttpClient) {}

  // private getSessionToken(): string | null {
  //   return localStorage.getItem('session_token');
  // }

  // private getHeaders(): HttpHeaders {
  //   const sessionToken = this.getSessionToken();
  //   return new HttpHeaders({
  //     Authorization: sessionToken ? `Bearer ${sessionToken}` : '',
  //     'Content-Type': 'application/json', // Ensure JSON format for requests
  //   });
  // }

  // getAll(): Observable<any> {
  //   const url = `${this.apiUrl}/api/police/collect/all`;
  //   return this.http.get(url).pipe(
  //     catchError(this.handleError)
  //   );
  // }

  // // Fetch all stations
  // getPolice(): Observable<IPolice[]> {
  //   const headers = this.getHeaders();
  //   return this.http
  //     .get<IPolice[]>(this.endpoints.police, { headers })
  //     .pipe(catchError(this.handleError));
  // }

  // // Fetch a specific station by station ID
  // getPoliceVerification(police_id: number): Observable<IPolice[]> {
  //   const headers = this.getHeaders();
  //   return this.http
  //     .get<IPolice[]>(this.endpoints.policeVerification(police_id), { headers })
  //     .pipe(catchError(this.handleError));
  // }

  // // Submit a new station
  // submitPolice(police: IPolice): Observable<IPolice> {
  //   const headers = this.getHeaders();
  //   return this.http
  //     .post<IPolice>(this.endpoints.submitPolice, police, { headers })
  //     .pipe(catchError(this.handleError));
  // }

  // // Update an existing station
  // editPolice(police_id: number, updatedPolice: IPolice): Observable<IPolice> {
  //   const headers = this.getHeaders();
  //   return this.http
  //     .put<IPolice>(this.endpoints.updatePolice(police_id), updatedPolice, {
  //       headers,
  //     })
  //     .pipe(catchError(this.handleError));
  // }

  // // Delete a station by ID
  // deletePolice(police_Id: number): Observable<void> {
  //   const headers = this.getHeaders();
  //   return this.http
  //     .delete<void>(this.endpoints.deletePolice(police_Id), { headers })
  //     .pipe(catchError(this.handleError));
  // }

  // getpoliceCollectAll(): Observable<IPolice[]> {
  //   const headers = this.getHeaders();
  //   return this.http.get<IPolice[]>(this.endpoints.police, { headers })
  //     .pipe(catchError(this.handleError));
  // }


  // Search stations based on a query string
  // searchStation(query: string): Observable<IStation[]> {
  //   const headers = this.getHeaders();
  //   return this.http.get<IStation[]>(this.endpoints.searchStation(query), { headers })
  //     .pipe(catchError(this.handleError));
  // }

  // Error handling function
//   private handleError(error: HttpErrorResponse): Observable<never> {
//     let errorMessage = 'An unknown error occurred!';
//     if (error.error instanceof ErrorEvent) {
//       errorMessage = `Client-side error: ${error.error.message}`;
//     } else {
//       if (error.status === 400 && error.error.errors) {
//         const validationErrors = error.error.errors;
//         errorMessage = this.formatValidationErrors(validationErrors);
//       } else {
//         errorMessage = `Server-side error: ${error.status}, message: ${
//           error.message
//         }, response: ${error.error ? JSON.stringify(error.error) : 'N/A'}`;
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
  providedIn: 'root',
})
export class StationListOfOfficersService {
  private apiUrl = `${environment.ipAddUrl}`;

  // API endpoints
  private endpoints = {
    police: `${this.apiUrl}api/police/collect/all`,
    localPolice: (stationId: number) => `${this.apiUrl}api/jurisdiction/retrieve/${stationId}`,
    submitPolice: `${this.apiUrl}api/police`,
    updatePolice: (id: number) => `${this.apiUrl}api/police/update/${id}`,
    deletePolice: (id: number) => `${this.apiUrl}api/police/discard/resign${id}`,
    // searchStation: (query: string) => `${this.apiUrl}api/jurisdiction/search?query=${query}`
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
  getLocalPolice(policeID: number): Observable<IPolice[]> {
    const headers = this.getHeaders();
    return this.http.get<IPolice[]>(this.endpoints.localPolice(policeID), { headers })
      .pipe(catchError(this.handleError));
  }

  // Submit a new station
  submitPolice(police: IPolice): Observable<IPolice> {
    const headers = this.getHeaders();
    return this.http.post<IPolice>(this.endpoints.submitPolice, police, { headers })
      .pipe(catchError(this.handleError));
  }

  // Update an existing station
  editPolice(policeID: number, updatedPolice: IPolice): Observable<IPolice> {
    const headers = this.getHeaders();
    return this.http.put<IPolice>(this.endpoints.updatePolice(policeID), updatedPolice, { headers })
      .pipe(catchError(this.handleError));
  }

  // Delete a station by ID
  // deleteStation(stationID: number): Observable<void> {
  //   const headers = this.getHeaders();
  //   return this.http.delete<void>(this.endpoints.deleteStation(stationID), { headers })
  //     .pipe(catchError(this.handleError));
  // }

  deletePolice(policeID: number): Observable<void> {
    if (!policeID || typeof policeID !== 'number') {
      return throwError(() => ({
        message: 'Invalid police ID provided for deletion.',
      }));
    }
  
    const headers = this.getHeaders();
    return this.http.delete<void>(this.endpoints.deletePolice(policeID), { headers })
      .pipe(catchError(this.handleError));
  }
  

  // Search stations based on a query string
  // searcPolice(query: string): Observable<IPolice[]> {
  //   const headers = this.getHeaders();
  //   return this.http.get<IPolice[]>(this.endpoints.searchPolice(query), { headers })
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
