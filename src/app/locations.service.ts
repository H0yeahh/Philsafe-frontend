import { Injectable } from '@angular/core';

import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from './environment';


export interface LocationData {
  locationId: number;
  province: string;
  municipality: string;
  street: string;
  region: string;
  barangay: string;
  block: string;
  latitude: number | null ;
  longtitude: number | null ;
}

@Injectable({
  providedIn: 'root'
})
export class LocationsService {

  private apiUrl = `${environment.ipAddUrl}api`;

  constructor(
    private http: HttpClient
  ) { }


  editLoc(locationId: number, locationData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/location/up/${locationId}`, locationData)
      .pipe(catchError(this.handleError));
  }



  private handleError(error: HttpErrorResponse): Observable<never> {
      let errorMessage = 'Unknown error!';
      if (error.error instanceof ErrorEvent) {
        errorMessage = `Client-side error: ${error.error.message}`;
      } else {
        errorMessage = `Server-side error: Status Code: ${error.status}\nMessage: ${error.message}`;
      }
      console.error(errorMessage);  // Log the error for debugging
      return throwError(() => new Error(errorMessage));
    }
}
