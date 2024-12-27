import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from './environment';

@Injectable({
  providedIn: 'root'
})
export class StationLoginService {


  private loginURL = `${environment.ipAddUrl}api/account/login`; // Replace with your actual API endpoint

  constructor(private http: HttpClient) {}

  login(data: { email: string; password: string }): Observable<any> {
    const options = { headers: new HttpHeaders({ 'Content-Type': 'multipart/form-data' }) };
    return this.http.post(this.loginURL, data, options).pipe(
      catchError(this.handleError)
    );
  }

  setAuthentication(auth: { token: string; role: string }) {
    const { token, role } = auth;
    localStorage.setItem('token', token);
    const accessRolesMap = new Map([
      ['admin', 'user,police,chief,admin'],
      ['user', 'user'],
      ['police', 'police'],
      ['chief', 'police,chief'],
    ]);
    const accessRole = accessRolesMap.get(role) || '';
    localStorage.setItem('access-roles', window.btoa(accessRole));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }

  getUserRoles(): Observable<string[]> {
    const roles = localStorage.getItem('access-roles') || null;
    return of(roles ? window.atob(roles).split(',') : []);
  }

  isAuthenticated(): Observable<boolean> {
    const authenticated = localStorage.getItem('token') || null;
    return of(!!authenticated);
  }
}