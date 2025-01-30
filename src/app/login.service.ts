import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from './environment';

export interface ILogin {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  // private loginURL = 'https://localhost:7108/api/account/login';
  private options = { headers: new HttpHeaders({ responseType: "json" }) };

  private loginURL = `${environment.ipAddUrl}api/account/login`

  constructor(
    private http: HttpClient
  ) { }

  // login(data: ILogin): Observable<any> {

    
  //   return this.http.post(this.loginURL, data, this.options).pipe(
  //     catchError(this.handleError)
  //   );
  // }


  login(data: ILogin): Observable<any> {
    return this.http.post(this.loginURL, data, { observe: 'response' }).pipe(
      map(response => {
        const authCookie = response.headers.get('set-cookie');
        if (authCookie) {
          localStorage.setItem('authCookie', authCookie);
        }
        return response.body;
      }),
      catchError(this.handleError)
    );
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
}