// import { Injectable } from '@angular/core';
// import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
// import { Observable, throwError } from 'rxjs';
// import { catchError } from 'rxjs/operators';

// export interface IReport {
//   reportBody: string;
//   citizen_id: number;
//   reportSubCategoryID: number;
//   locationID?: number;
//   stationID: number;
//   crimeID?: number;
//   // reportedate: string;
//   incidentDate?: string;
//   blotterNum: string;
//   hasAccount: boolean;
//   eSignature: number[] | Uint8Array | Blob;  
//   reportSubCategory: string;
//   subcategory_name: string;
  
//   report_id: number;
//   type: string;
//   complainant: string;
//   reported_date: string;  

//   ReportBody: string; 
//   ReportSubCategoryId: string;
//   DateTimeReportedDate: string;
//   DateTimeIncidentDate?: string;
//   HasAccount: string;
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class CaseQueueService {
//   private apiUrl = 'https://localhost:7108';  // Base API URL

//   // API endpoints
//   private endpoints = {
//     reports: `${this.apiUrl}/api/report`,
//     localReports: (stationId: number) => `${this.apiUrl}/api/report/retrieve/local/${stationId}`,
//     nationwideReports: `${this.apiUrl}/api/report/retrieve/nationwide`,
//     submitReport: `${this.apiUrl}/api/report/submit`,
//     citizenReports: `${this.apiUrl}/api/report/retrieve/citizen`,
//     categorizedReports: (subcategoryId: number) => `${this.apiUrl}/api/report/retrieve/category/${subcategoryId}`,
//     crimeReports: (crimeId: number) => `${this.apiUrl}/api/report/retrieve/case/${crimeId}`,
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
//   getReports(stationId: number): Observable<IReport[]> {
//     const headers = this.getHeaders();
//     return this.http.get<IReport[]>(this.endpoints.localReports(stationId), { headers })
//       .pipe(catchError(this.handleError));
//   }

//   // Fetch all nationwide reports
//   getNationwideReports(): Observable<IReport[]> {
//     const headers = this.getHeaders();
//     return this.http.get<IReport[]>(this.endpoints.nationwideReports, { headers })
//       .pipe(catchError(this.handleError));
//   }

//   // Submit a new report
//   submitReport(report: IReport): Observable<IReport> {
//     const headers = this.getHeaders();
//     return this.http.post<IReport>(this.endpoints.submitReport, report, { headers })
//       .pipe(catchError(this.handleError));
//   }

//   // Fetch reports specific to a citizen
//   getCitizenReports(): Observable<IReport[]> {
//     const headers = this.getHeaders();
//     return this.http.get<IReport[]>(this.endpoints.citizenReports, { headers })
//       .pipe(catchError(this.handleError));
//   }

//   // Fetch categorized reports
//   getCategorizedReports(subcategoryId: number): Observable<IReport[]> {
//     const headers = this.getHeaders();
//     return this.http.get<IReport[]>(this.endpoints.categorizedReports(subcategoryId), { headers })
//       .pipe(catchError(this.handleError));
//   }

//   // Fetch reports by specific crime ID
//   getCrimeReports(crimeId: number): Observable<IReport[]> {
//     const headers = this.getHeaders();
//     return this.http.get<IReport[]>(this.endpoints.crimeReports(crimeId), { headers })
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


import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface IReport {
  reportBody: string;
  citizen_id: number;
  reportSubCategoryID: number;
  locationID?: number;
  stationID: number;
  crimeID?: number;
  incidentDate?: string;
  blotterNum: string;
  hasAccount: boolean;
  eSignature: number[] | Uint8Array | Blob;
  reportSubCategory: string;
  subcategory_name: string;
  report_id: number;
  type: string;
  complainant: string;
  reported_date: string;
  ReportBody: string;
  ReportSubCategoryId: string;
  DateTimeReportedDate: string;
  DateTimeIncidentDate?: string;
  HasAccount: string;
}

@Injectable({
  providedIn: 'root'
})
export class CaseQueueService {
  private apiUrl = 'https://localhost:7108';  // Base API URL

  // API endpoints
  private endpoints = {
    reports: `${this.apiUrl}/api/report`,
    localReports: (stationId: number) => `${this.apiUrl}/api/report/retrieve/local/${stationId}`,
    nationwideReports: `${this.apiUrl}/api/report/retrieve/nationwide`,
    submitReport: `${this.apiUrl}/api/report/submit`,
    citizenReports: `${this.apiUrl}/api/report/retrieve/citizen`,
    categorizedReports: (subcategoryId: number) => `${this.apiUrl}/api/report/retrieve/category/${subcategoryId}`,
    crimeReports: (crimeId: number) => `${this.apiUrl}/api/report/retrieve/case/${crimeId}`,
    moveToEndorsedQueue: (reportId: number) => `${this.apiUrl}/api/report/move-to-endorsed-queue/${reportId}`,  // New endpoint for moving report
  };

  constructor(private http: HttpClient) {}

  // Helper function to get the session token
  private getSessionToken(): string | null {
    return localStorage.getItem('session_token');  // Replace with your token key
  }

  // Helper function to get the headers with session token
  private getHeaders(): HttpHeaders {
    const sessionToken = this.getSessionToken();
    return new HttpHeaders({
      'Authorization': sessionToken ? `Bearer ${sessionToken}` : ''
    });
  }

  // Fetch reports for a specific station
  getReports(stationId: number): Observable<IReport[]> {
    const headers = this.getHeaders();
    return this.http.get<IReport[]>(this.endpoints.localReports(stationId), { headers })
      .pipe(catchError(this.handleError));
  }

  // Fetch all nationwide reports
  getNationwideReports(): Observable<IReport[]> {
    const headers = this.getHeaders();
    return this.http.get<IReport[]>(this.endpoints.nationwideReports, { headers })
      .pipe(catchError(this.handleError));
  }

  // Submit a new report
  submitReport(report: IReport): Observable<IReport> {
    const headers = this.getHeaders();
    return this.http.post<IReport>(this.endpoints.submitReport, report, { headers })
      .pipe(catchError(this.handleError));
  }

  // Fetch reports specific to a citizen
  getCitizenReports(): Observable<IReport[]> {
    const headers = this.getHeaders();
    return this.http.get<IReport[]>(this.endpoints.citizenReports, { headers })
      .pipe(catchError(this.handleError));
  }

  // Fetch categorized reports
  getCategorizedReports(subcategoryId: number): Observable<IReport[]> {
    const headers = this.getHeaders();
    return this.http.get<IReport[]>(this.endpoints.categorizedReports(subcategoryId), { headers })
      .pipe(catchError(this.handleError));
  }

  // Fetch reports by specific crime ID
  getCrimeReports(crimeId: number): Observable<IReport[]> {
    const headers = this.getHeaders();
    return this.http.get<IReport[]>(this.endpoints.crimeReports(crimeId), { headers })
      .pipe(catchError(this.handleError));
  }

  // New method for moving a report to the endorsed queue
  moveToEndorsedQueue(reportId: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post<any>(this.endpoints.moveToEndorsedQueue(reportId), {}, { headers })
      .pipe(catchError(this.handleError));
  }

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
        errorMessage = `Server-side error: ${error.status}, message: ${error.message}, response: ${error.error ? JSON.stringify(error.error) : 'N/A'}`;
      }
    }

    // Log the full error for debugging
    console.error('Full error details:', error);

    return throwError({
      message: errorMessage,
      status: error.status,
      error: error.error,
    });
  }

  dismissReport(reportId: number): Observable<any> {
    const headers = this.getHeaders(); // Retrieve headers with the session token
    const url = `${this.apiUrl}/api/report/dismiss/${reportId}`; // Construct the dismiss endpoint
    return this.http.post<any>(url, {}, { headers }) // POST request with an empty body
      .pipe(
        catchError(this.handleError) // Handle errors
      );
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
