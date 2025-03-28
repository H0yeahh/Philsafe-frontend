import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from './environment';

export interface IReport{
message: string;
code: number;
}
@Injectable({
  providedIn: 'root'
})
export class StationReportsService {
  private apiUrl = `${environment.ipAddUrl}`;  // Backend API endpoint
  private reportsApiUrl = `${this.apiUrl}api/report/retrieve/citizen`;  // Backend API endpoint

  private token = localStorage.getItem('token') ?? '';

  
  
  private auth_token = new HttpHeaders({
      'Authorization': this.token
  })
  
  constructor(private http: HttpClient) { }

    
  getReports(): Observable<any[]> {
    return this.http.get<any[]>(this.reportsApiUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!'; // Default message
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.status === 400 && error.error.errors) {
        // Validation errors
        const validationErrors = error.error.errors;
        errorMessage = this.formatValidationErrors(validationErrors);
      } else {
        // General server error
        errorMessage = `Server-side error: ${error.status}, message: ${error.message}, response: ${error.error ? JSON.stringify(error.error) : 'N/A'}`;
      }
    }

    // Log the full error for debugging
    console.error('Full error details:', error);

    // Return the error message (structured if needed)
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


  // Fetch all nationwide reports
  getNationwideReports(): Observable<any> {
    return this.http.get(`${this.apiUrl}/retrieve/nationwide`);
  }

  // Fetch local station reports (specific to logged-in station)
  getLocalReports(): Observable<any> {
    return this.http.get(`${this.apiUrl}/retrieve/local`);
  }

  // Fetch reports specific to a citizen
  getCitizenReports(): Observable<any> {
    return this.http.get(`${this.apiUrl}/retrieve/citizen`);
  }

  // Fetch categorized reports
  getCategorizedReports(subcategoryId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/retrieve/category/${subcategoryId}`);
  }

  // Fetch reports by specific crime ID
  getCrimeReports(crimeId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/retrieve/case/${crimeId}`);
  }
}
function throwError(arg0: { message: string; status: number; error: any; }): Observable<never> {
  throw new Error('Function not implemented.');
}

