import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { response } from 'express';

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
export class CreateCaseService {
  private readonly baseUrl = 'https://localhost:7108/api/case'; // Base URL
  private readonly endpoints = {
    // getAll: `${this.baseUrl}/retrieve/citizen`,
    getAll: `${this.baseUrl}/retrieve/nationwide`,
    submitCase: `${this.baseUrl}`, // Add the endpoint for submitting reports
    
  };

  constructor(private http: HttpClient) {}

  // Helper function to get the session token (from localStorage or cookies)
  private getSessionToken(): string | null {
    return localStorage.getItem('session_token');  // Replace 'session_token' with your token key
  }

  // Helper function to get the headers with session token
  private getHeaders(): HttpHeaders {
    const sessionToken = this.getSessionToken();
    return new HttpHeaders({
      'Authorization': sessionToken ? `Bearer ${sessionToken}` : ''
    });
  }

  // Fetch all citizen reports
  getAll(): Observable<ICase[]> {  // Strongly typed response
    const headers = this.getHeaders();  // Add headers with session token
    
    return this.http.get<ICase[]>(this.endpoints.getAll, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Submit a new report
  submitReport(report: ICase): Observable<ICase> {  // Assuming the server returns the submitted report
    const headers = this.getHeaders();  // Add headers with session token
    
    return this.http.post<ICase>(this.endpoints.submitCase, report, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  

  // Error handling function
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Unknown error!';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      
      if (error.error && typeof error.error === 'object') {
        // Log full error details including server response
        console.error('Server-side error details:', error.error);
      }
    }

    // Log full error for debugging
    console.error('Full error details:', error);

    return throwError(errorMessage);
  }
}
