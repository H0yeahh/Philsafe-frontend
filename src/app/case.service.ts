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

interface DateCommitted{
  year: number;
  month: number;
  day: number;
  dayOfWeek: number;
}

export interface Crime {
  crimeId: number;
  title: string,
  offenseType: string,
  citeNumber: string,
  dateTimeReported: string,
  dateTimeCommitted: string,
  dateCommitted: DateCommitted;
  dateReported: string;
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
    getAllCitizen: `${this.baseUrl}citizen/collect/citizens/all`,
    getAllSpammers: `${this.baseUrl}citizen/collect/spammers/all`,
    getAllSpammedReports: `${this.baseUrl}report/retrieve/archivedReports`,
    getAllReports: `${this.baseUrl}report/retrieve/nationwide`,
    submitReport: `${this.baseUrl}report/submit`, // Add the endpoint for submitting report
  };

  private token = localStorage.getItem('token') ?? '';

  private auth = new HttpHeaders({
      'Content-Type': 'application/json',
    
    });
 
    private auth_token = new HttpHeaders({
    
      'Authorization': this.token
    });

  constructor(private http: HttpClient) {}

  private getSessionToken(): string | null {
    return localStorage.getItem('session_token'); 
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
    
    
    return this.http.get<IReport[]>(this.endpoints.getAll, {headers: this.auth_token}).pipe(
      catchError(this.handleError)
    );
  }

  // getTotalUsers(): Observable<number> {
  //   return this.http.get<number>(`${this.baseUrl}citizen/collect/citizens/all`);
  // }

  // getTotalUsers(): Observable<number> {
  //   return this.http.get<{ count: number }>(`${this.baseUrl}citizen/collect/citizens/all`).pipe(
  //     map(response => response.count) // Extract the `count` value from the response
  //   );
  // }

  certifyUser(citizenId: any): Observable<any> {
    return this.http.put(`${this.baseUrl}citizen/certify/${citizenId}`, {}, {headers: this.auth_token}).pipe(
      catchError(this.handleError)
    );
  }

  getCitizenProof(citizenId: any) {
    const url = `${this.baseUrl}citizen/retrieve/proof/${citizenId}`;
    return this.http.get(url, {headers: this.auth_token, responseType: 'blob'}).pipe(
      catchError(this.handleError)
    );
  }


  getTotalUsers(): Observable<number> {
    return this.http.get<any[]>(`${this.baseUrl}citizen/collect/citizens/all`, {headers: this.auth_token}).pipe(
      map(users => users.length)
    );
  }

  getTotalSpammers(): Observable<number> {
    return this.http.get<any[]>(`${this.baseUrl}citizen/collect/spammers/all`, {headers: this.auth_token}).pipe(
      map(users => users.length)
    );
  }

  getAllCases(): Observable<any> {  
    
    return this.http.get<any>(this.endpoints.getAllCases, {headers: this.auth_token}).pipe(
      catchError(this.handleError)
    );
  }


    getAllCasesPage(pageSize: any, pageNumber: any): Observable<any> {  
    
    return this.http.get<any>(`${this.endpoints.getAllCases}/${pageSize}/${pageNumber}`, {headers: this.auth_token}).pipe(
      catchError(this.handleError)
    );
  }

  getAllCitizens(): Observable<any> {  
    return this.http.get<any>(this.endpoints.getAllCitizen, {headers: this.auth_token}).pipe(
      catchError(this.handleError)
    );
  }

  getAllSpammers(): Observable<any> { 
    return this.http.get<any>(this.endpoints.getAllSpammers, {headers: this.auth_token}).pipe(
      catchError(this.handleError)
    );
  }

  getAllSpamReports(): Observable<any> {  
    return this.http.get<any>(this.endpoints.getAllSpammedReports, {headers: this.auth_token}).pipe(
      catchError(this.handleError)
    );
  }

  getAllReports(): Observable<any> {  
    return this.http.get<any>(this.endpoints.getAllReports, {headers: this.auth_token}).pipe(
      catchError(this.handleError)
    );
  }

  getAllReportsPage(pageSize: any, pageNumber: any): Observable<any> {  
    return this.http.get<any>(`${this.endpoints.getAllReports}/${pageSize}/${pageNumber}`, {headers: this.auth_token}).pipe(
      catchError(this.handleError)
    );
  }

  // Submit a new report
  submitReport(report: IReport): Observable<IReport> { 
    
    return this.http.post<IReport>(this.endpoints.submitReport, report, {headers: this.auth_token}).pipe(
      catchError(this.handleError)
    );
  }
  postCase(caseData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}case`, caseData, {headers: this.auth_token}).pipe(
      catchError(this.handleError)
    );
  }

  connectDot(reportId: number, crimeId: number, caseData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}report/connect/dot/${reportId}/${crimeId}`, caseData, {headers: this.auth_token}).pipe(
      catchError(this.handleError)
    );
  }

  collectCrimeReports(crimeId: number, caseData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}report/retrieve/case/${crimeId}`, caseData, {headers: this.auth_token}).pipe(
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
