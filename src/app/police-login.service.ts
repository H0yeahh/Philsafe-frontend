import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from './environment';

@Injectable({
  providedIn: 'root'
})
export class PoliceLoginService {
  private loginURL = `${environment.ipAddUrl}api/account/login`; // Replace with your actual API endpoint
  private readonly ADMIN_USERNAME = 'admin';
  private readonly ADMIN_PASSWORD = 'admin';

  constructor(private http: HttpClient) {}

  login(data: { username: string; password: string; signInType: string }): Observable<any> {
    // Check for admin login
    if (data.username === this.ADMIN_USERNAME && data.password === this.ADMIN_PASSWORD) {
      return this.handleAdminLogin();
    }

    const options = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<{ token: string; role: string }>(this.loginURL, data, options).pipe(
      tap(response => this.setAuthentication(response)),
      catchError(this.handleError)
    );
  }

  private handleAdminLogin(): Observable<any> {
    const adminAuth = {
      token: 'admin-token', // You might want to generate a proper token
      role: 'admin'
    };
    this.setAuthentication(adminAuth);
    return of(adminAuth);
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
    return throwError(() => errorMessage);
  }

  getUserRoles(): Observable<string[]> {
    const roles = localStorage.getItem('access-roles') || null;
    return of(roles ? window.atob(roles).split(',') : []);
  }

  isAuthenticated(): Observable<boolean> {
    const authenticated = localStorage.getItem('token') || null;
    return of(!!authenticated);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('access-roles');
  }
}