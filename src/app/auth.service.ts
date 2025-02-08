import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
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
     private authCookie: string | null = null;
     

  constructor(private http: HttpClient) { }
 
 
  // login(data: ILogin): Observable<any> {
  //   return this.http.post(this.loginURL, data, this.options).pipe(
  //   catchError(this.handleError)
  //   );
  // }

   login(data: ILogin): Observable<any> {
      return this.http.post(this.loginURL, data, { 
        observe: 'response',
        withCredentials: true
      }).pipe(
        map(response => {
         console.log('Response', response)
          return response.body;
        }),
        catchError(this.handleError)
      );
    }

  // login(data: ILogin): Observable<any> {
  //   return this.http.post(this.loginURL, data, {
  //     observe: 'response', // Get full response, including headers
  //     // withCredentials: true, // Allow cookies to be stored
  //   }).pipe(
  //     tap(response => {
  //       const cookies = response.headers.get('Set-Cookie');
  //       if (cookies) {
  //         console.log('Set-Cookie header:', cookies);
  //         this.authCookie = cookies.split(';')[0]; // Store only the cookie value
  //       }
  //     }),
  //     catchError(this.handleError)
  //   );
  // }


    // login(data: ILogin): Observable<any> {
    //   return this.http.post(this.loginURL, data, {
    //     observe: 'response', // Get full response, including headers
    //     withCredentials: true, // Allow cookies to be stored
    //   }).pipe(
    //     tap(response => {
    //       const cookies = response.headers.get('Set-Cookie');
    //       if (cookies) {
    //         console.log('Set-Cookie header:', cookies);
    //         this.authCookie = cookies.split(';')[0]; // Store only the cookie value
    //       }
    //     }),
    //     catchError(this.handleError)
    //   );
    // }
  
  
    // private presentAlert(message: string): void {
    //   alert(message);
    // }
    



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

  private presentAlert(message: string): void {
    alert(message);
  }
  
  private handleError = (error: HttpErrorResponse): Observable<never> => {
    let errorMessage = 'An unknown error occurred!';
  
    if (error.status === 401) {
      if (error.error && error.error.message) {
        errorMessage = error.error.message;
      } else {
        errorMessage = 'Unauthorized, You must be a citizen';
      }
    } else if (error.status === 0) {
      errorMessage = 'Server not found';
    } else if (error.status === 500) {
      errorMessage = 'Internal Server Error';
    }
    this.presentAlert(errorMessage);
    return throwError(() => new Error(errorMessage));
  };

  
  getUserRoles(): Observable<string[]> {
    const roles = localStorage.getItem('access-roles') || null;
    return of(roles ? window.atob(roles).split(',') : [])
  }

  isAuthenticated(): Observable<boolean> {
    const authenticated = localStorage.getItem('token') || null;
    return !!authenticated ? of(true) : of(false);
  }


  getAuthCookie(): string | null {
    return localStorage.getItem('authCookie');
  }

}

