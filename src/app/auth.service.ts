import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { environment } from './environment';

export interface ILogin {
  email: string;
  password: string;
  SignInType: string; 
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {


  // set roles -> localStorage.setItem('roles', window.btoa('admin,user'));
  // private loginURL = 'https://localhost:7108/api/account/login';
  // private options = { headers: new HttpHeaders({ responseType: "json" }) };
  private options = {
    headers: new HttpHeaders({
      'Content-Type': 'multipart/formdata'})
    };

     private loginURL = `${environment.ipAddUrl}api/account/login`;
     private logoutURL = `${environment.ipAddUrl}api/account/signout`;
     

  constructor(private http: HttpClient) { }
  login(data: ILogin): Observable<any> {
    return this.http.post(this.loginURL, data, this.options).pipe(
    catchError(this.handleError)
    );
  }

  logout(): Observable<any> {
    return this.http.post(this.logoutURL, this.options).pipe(
    catchError(this.handleError)
    );
  }

  setAuthentication(auth: { token: string, role: string }) {
    const { token, role } = auth
    localStorage.setItem('token', token)
    const accessRolesMap = new Map([
      ['admin', 'user,police,chief,admin'],
      ['user', 'user'],
      ['police', 'police'],
      ['chief', 'police,chief'],
    ])
    const accessRole = accessRolesMap.get(role) || ''
    localStorage.setItem('access-roles', window.btoa(accessRole))
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
    return of(roles ? window.atob(roles).split(',') : [])
  }

  isAuthenticated(): Observable<boolean> {
    const authenticated = localStorage.getItem('token') || null;
    return !!authenticated ? of(true) : of(false);
  }

}