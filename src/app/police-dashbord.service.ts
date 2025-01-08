import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from './environment';

export interface IReport {
  report_id: number;
  type: string;
  complainant: string;
  reportBody: string;
  citizen_id: number;
  reportSubCategoryID: number;
  locationID?: number;
  stationID: number;
  crimeID?: number;
  reportedDate: string;
  incidentDate?: string;
  blotterNum: string;
  hasAccount: boolean;
  eSignature: number[] | Uint8Array | Blob;
  reportSubCategory: string;
  subcategory_name: string;
  status: string;
  result: string;
}

@Injectable({
  providedIn: 'root',
})
export class PoliceDashbordService {
  private apiUrl = `${environment.ipAddUrl}`;

  private endpoints = {
    reports: `${this.apiUrl}/api/report`,
    localReports: (stationId: number) => `${this.apiUrl}/api/report/retrieve/local/${stationId}`,
    nationwideReports: `${this.apiUrl}/api/report/retrieve/nationwide`,
    submitReport: `${this.apiUrl}/api/report/submit`,
    citizenReports: `${this.apiUrl}/api/report/retrieve/citizen`,
    categorizedReports: (subcategoryId: number) => `${this.apiUrl}/api/report/retrieve/category/${subcategoryId}`,
    crimeReports: (crimeId: number) => `${this.apiUrl}/api/report/retrieve/case/${crimeId}`,
    admin:  `${this.apiUrl}api/admin/grant`,
  };

  constructor(private http: HttpClient) {}

  private getSessionToken(): string | null {
    const token = localStorage.getItem('session_token');
    if (!token) {
      console.error('Session token is missing. Please log in again.');
    }
    return token;
  }

  private getHeaders(): HttpHeaders {
    const sessionToken = this.getSessionToken();
    return new HttpHeaders({
      Authorization: sessionToken ? `Bearer ${sessionToken}` : '',
      'Content-Type': 'application/json',
    });
  }

  getReportData(
    stationId: number
  ): Observable<{
    dailyReports: number;
    weeklyReports: number;
    monthlyReports: number;
    annualReports: number;
    chartData: any;
  }> {
    const headers = this.getHeaders();
    return this.http
      .get<{
        dailyReports: number;
        weeklyReports: number;
        monthlyReports: number;
        annualReports: number;
        chartData: any;
      }>(this.endpoints.localReports(stationId), { headers })
      .pipe(catchError(this.handleError));
  }

  getReports(stationId: number): Observable<IReport[]> {
    const headers = this.getHeaders();
    return this.http
      .get<IReport[]>(this.endpoints.localReports(stationId), { headers })
      .pipe(catchError(this.handleError));
  }

  getAdmin(accountID: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http
      .get<any>(`${this.endpoints.admin}/${accountID}`, { headers })
      .pipe(catchError(this.handleError));
  }

  getNationwideReports(): Observable<IReport[]> {
    const headers = this.getHeaders();
    return this.http
      .get<IReport[]>(this.endpoints.nationwideReports, { headers })
      .pipe(catchError(this.handleError));
  }

  submitReport(report: IReport): Observable<IReport> {
    const headers = this.getHeaders();
    return this.http
      .post<IReport>(this.endpoints.submitReport, report, { headers })
      .pipe(catchError(this.handleError));
  }

  getCitizenReports(): Observable<{ reports: IReport[]; total: number }> {
    const headers = this.getHeaders();
    return this.http
      .get<{ reports: IReport[]; total: number }>(this.endpoints.citizenReports, {
        headers,
      })
      .pipe(catchError(this.handleError));
  }

  getCategorizedReports(subcategoryId: number): Observable<IReport[]> {
    const headers = this.getHeaders();
    return this.http
      .get<IReport[]>(this.endpoints.categorizedReports(subcategoryId), { headers })
      .pipe(catchError(this.handleError));
  }

  getCrimeReports(crimeId: number): Observable<IReport[]> {
    const headers = this.getHeaders();
    return this.http
      .get<IReport[]>(this.endpoints.crimeReports(crimeId), { headers })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      switch (error.status) {
        case 400:
          errorMessage = 'Bad Request. Please check the submitted data.';
          break;
        case 401:
          errorMessage = 'Unauthorized. Please log in again.';
          break;
        case 404:
          errorMessage = 'Resource not found. Please try again.';
          break;
        case 500:
          errorMessage = 'Internal Server Error. Please try again later.';
          break;
        default:
          errorMessage = `Server-side error: ${error.status}, message: ${error.message}`;
      }
    }

    console.error('Full error details:', error);
    return throwError({
      message: errorMessage,
      status: error.status,
      error: error.error,
    });
  }
}
