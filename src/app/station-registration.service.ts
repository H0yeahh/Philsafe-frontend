import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { IStation } from './jurisdiction.service'
import { environment } from './environment';


@Injectable({
  providedIn: 'root'
})
export class StationRegistrationService {

  private base =  `${environment.ipAddUrl}`;
  private apiUrl = `${this.base}api/jurisdiction`;
  private stationURL = `${this.base}api/jurisdiction`;


  constructor(private http: HttpClient) {}

  saveStationData(stationData: any): Observable<any> {
    return this.http.post(this.apiUrl, stationData).pipe(
      tap(response => console.log('Save station response:', response)),
      catchError(this.handleError)
    );
  }

  getAllStations(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      tap(response => console.log('Get all stations response:', response)),
      catchError(this.handleError)
    );
  }

  getStationById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      tap(response => console.log(`Get station ${id} response:`, response)),
      catchError(this.handleError)
    );
  }

  updateStationData(id: number, stationData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, stationData).pipe(
      tap(response => console.log(`Update station ${id} response:`, response)),
      catchError(this.handleError)
    );
  }

  deleteStation(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap(response => console.log(`Delete station ${id} response:`, response)),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Backend returned an unsuccessful response code
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}