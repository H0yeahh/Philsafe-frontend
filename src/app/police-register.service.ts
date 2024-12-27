import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from './environment';

export interface IRank {
  rank_id: number;
  rank_abbr: string;
  rank_full: string;
}

export interface IPolice {
  unit: string;
  role: string;
  badgeNumber: string;
  debutDate: string;
  stationID?: number;
  personID?: number;
  // personId?: number;
  pfpId?: number;
  rankID?: number;
  createdBy: string;
  datetimeCreated: string;
}

export interface IPictureUploadResponse {
  pfpId: string; // Assuming this is the response structure for uploading a picture
}

@Injectable({
  providedIn: 'root'
})
export class PoliceRegisterService {
  private base = `${environment.ipAddUrl}`
  private apiUrl = `${environment.ipAddUrl}api/police`;
  // private apiUrl = 'https://localhost:7108/api/police/upgrade';  // API URL for registration
  private ranksApiUrl = `${environment.ipAddUrl}api/police/load/ranks`; // API URL for fetching ranks
  private pictureUploadUrl = `${environment.ipAddUrl}api/police/upload-picture`; // API URL for uploading picture
  private stationURL = `${environment.ipAddUrl}api/jurisdiction`;

  constructor(private http: HttpClient) {}

  // Function to register a new police user
  register(data: IPolice): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        // 'Content-Type': 'text/pain',
      })
    };

    return this.http.post<any>(this.apiUrl, data, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Function to get the list of ranks
  getRanks(): Observable<IRank[]> {
    return this.http.get<IRank[]>(this.ranksApiUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Upload profile picture
  uploadPicture(file: FormData): Observable<IPictureUploadResponse> {
    return this.http.post<IPictureUploadResponse>(this.pictureUploadUrl, file).pipe(
      tap(response => console.log('Picture upload response:', response)),
      catchError(this.handleError)
    );
  }

  // Save police data
  savePoliceData(policeData: IPolice): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.post(this.apiUrl, policeData, httpOptions).pipe(
      tap(response => console.log('Save police response:', response)),
      catchError(this.handleError)
    );
  }

  // Update police data
  updatePoliceData(id: number, policeData: IPolice): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.put(`${this.apiUrl}/${id}`, policeData, httpOptions).pipe(
      tap(response => console.log(`Update police ${id} response:`, response)),
      catchError(this.handleError)
    );
  }

  // Get all police data
  getAllPoliceData(): Observable<IPolice[]> {
    return this.http.get<IPolice[]>(this.apiUrl).pipe(
      tap(response => console.log('Get all police response:', response)),
      catchError(this.handleError)
    );
  }

  // Delete police data
  deletePolice(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap(response => console.log(`Delete police ${id} response:`, response)),
      catchError(this.handleError)
    );
  }

  // Get police by ID
  getPoliceById(id: number): Observable<IPolice> {
    return this.http.get<IPolice>(`${this.apiUrl}/${id}`).pipe(
      tap(response => console.log(`Get police ${id} response:`, response)),
      catchError(this.handleError)
    );
  }

  // Error handling function
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Backend returned an unsuccessful response code
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
  
}






































// import { Injectable } from '@angular/core';
// import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
// import { Observable, throwError } from 'rxjs';
// import { catchError } from 'rxjs/operators';

// // Define interfaces for better type safety
// interface RegistrationData {
//   rank: string;
//   provincialOffice: string;
//   name: string;
//   regionalOffice: string;
//   officerCommander: string;
//   city: string;
//   badgeNumber: string;
//   wcpc: string;
//   investigator: string;
//   unit: string;
//   role: string;
//   debutDate: string;
//   datetimeCreated: string;
//   createdBy: string;
// }

// interface Rank {
//   rank_id: string;
//   rank_full: string;
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class PoliceRegisterService {
//   private apiUrl = 'https://localhost:7108/api/police'; // API URL for registration
//   private ranksApiUrl = 'https://localhost:7108/api/police/load/ranks'; // API URL for fetching ranks

//   constructor(private http: HttpClient) {}

//   // Function to register a new police user
//   register(data: RegistrationData): Observable<any> {
//     const httpOptions = {
//       headers: new HttpHeaders({
//         'Content-Type': 'application/json'
//       })
//     };

//     return this.http.post<any>(this.apiUrl, data, httpOptions)
//       .pipe(
//         catchError(this.handleError)
//       );
//   }

//   // Function to get the list of ranks
//   getRanks(): Observable<Rank[]> {
//     return this.http.get<Rank[]>(this.ranksApiUrl)
//       .pipe(
//         catchError(this.handleError)
//       );
//   }

//   // Enhanced error handling method
//   private handleError(error: HttpErrorResponse): Observable<never> {
//     let errorMessage = 'An unknown error occurred!'; // Default message
    
//     if (error.error instanceof ErrorEvent) {
//       // Client-side error
//       errorMessage = `Client-side error: ${error.error.message}`;
//     } else {
//       // Server-side error
//       if (error.status === 400 && error.error && error.error.errors) {
//         // Validation errors
//         const validationErrors = error.error.errors;
//         errorMessage = this.formatValidationErrors(validationErrors);
//       } else {
//         // General server error
//         errorMessage = `Server-side error: ${error.status}, message: ${error.message}, response: ${error.error ? JSON.stringify(error.error) : 'N/A'}`;
//       }
//     }

//     // Log the full error for debugging
//     console.error('Full error details:', error);

//     // Return the error message (structured if needed)
//     return throwError(() => ({
//       message: errorMessage,
//       status: error.status,
//       error: error.error,
//     }));
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