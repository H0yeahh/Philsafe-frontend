import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { response } from 'express';
import { environment } from './environment';

export interface IReport {
  reportBody?: string;
  citizen_id: number;
  reportSubCategoryID: number;
  locationID?: number;
  stationID: number;
  crimeID?: number;
  // reportedDate: string;  
  incidentDate?: string;
  blotterNum: string;
  hasAccount: boolean;
  eSignature: number[] | Uint8Array | Blob;  
  reportSubCategory: string;
  subcategory_name: string;
  report_id: number;
  type?: string;
  complainant: string;
  reported_date: string;  

  ReportBody: string; 
  ReportSubCategoryId: string;
  DateTimeReportedDate: string;
  DateTimeIncidentDate?: string;
  HasAccount: string;
  color?: string;
  status: string;
  is_spam?: string;
}

export interface Crime {
  crimeId: number;
  title: string,
  offenseType: string,
  citeNumber: string,
  dateTimeReported: string,
  dateTimeCommitted: string,
  description: string,
  status: string,
  incidentTypeId: number,
  dateTimeCreated: string,
  lastModified: string,
  createdBy: string,
  modifiedBy: string,
  locationId: 0,
  stationId: 0,

  victim_id_list: number[],
  suspect_id_list: number[],
  police_id_list: number[]

}

@Injectable({
  providedIn: 'root'
})
export class CaseService {
  private readonly baseUrl = `${environment.ipAddUrl}api/`; // Base URL
  private readonly endpoints = {
    // getAll: `${this.baseUrl}/retrieve/citizen`,
    getAll: `${this.baseUrl}report/retrieve/nationwide`,
    getAllCases: `${this.baseUrl}case/retrieve/nationwide`,

    submitReport: `${this.baseUrl}report/submit`, // Add the endpoint for submitting reports
    
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
  getAll(): Observable<IReport[]> {  // Strongly typed response
    const headers = this.getHeaders();  // Add headers with session token
    
    return this.http.get<IReport[]>(this.endpoints.getAll, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  getAllCases(): Observable<any> {  // Strongly typed response
    const headers = this.getHeaders();  // Add headers with session token
    return this.http.get<any>(this.endpoints.getAllCases, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Submit a new report
  submitReport(report: IReport): Observable<IReport> {  // Assuming the server returns the submitted report
    const headers = this.getHeaders();  // Add headers with session token
    
    return this.http.post<IReport>(this.endpoints.submitReport, report, { headers }).pipe(
      catchError(this.handleError)
    );
  }
  postCase(caseData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}case`, caseData).pipe(
      catchError(this.handleError)
    );
  }

  connectDot(reportId: number, crimeId: number, caseData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}connect/dot/${reportId}/${crimeId}`, caseData).pipe(
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
