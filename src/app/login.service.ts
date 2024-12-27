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

  constructor(private http: HttpClient) { }

  login(data: ILogin): Observable<any> {
    return this.http.post(this.loginURL, data, this.options).pipe(
      catchError(this.handleError)
    );
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
}