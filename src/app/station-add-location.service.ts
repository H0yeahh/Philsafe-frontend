
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from './environment';

interface LocationResult {
  message: string;
  code: string;
  id: number;
}


export interface ILocation {
  location_id?: number;
  region: string;
  province: string;
  municipality: string;
  barangay: string;
  street: string;
  blockLotUnit: string;
  zipCode: number;

  // eSigniture: number[] | Uint8Array | Blob; for report parameter
}

@Injectable({
  providedIn: 'root',
})
export class StationAddLocationService {
  // private accountURL = 'https://localhost:7108/api/account/signup';
  private base = `${environment.ipAddUrl}`;
  private personURL = `${this.base}api/person`;
  private locationURL = `${this.base}api/location/create/`;
  
  private options = { headers: new HttpHeaders({ responseType: "json" }) }
  // private options = {
  //   headers: new HttpHeaders({
  //     'Content-Type': 'multipart/form-data'})
  //   };



  constructor(private http: HttpClient) {
  }


  postLocation(zipCode: number, data: ILocation): Observable<any> {
    const url = `${this.locationURL}${zipCode}`;
    return this.http.post(url, data, this.options).pipe(
      catchError(this.handleError)
    );
  }
  // https://localhost:7108/api/location/retrieve/all
  getLocations(): Observable<any> {
    const url = `${this.base}/api/location/retrieve/all`;
    return this.http.get(url).pipe(
      catchError(this.handleError)
    );
  }
  createOrRetrieveLocation(locationData: ILocation, zipCode: number): Observable<any> {
    return this.http.post(`${this.locationURL}${zipCode}`, locationData, { observe: 'response' })
      .pipe(
        map((response: HttpResponse<any>) => {
          if (response.status === 200) {
            return { locationFound: true, locationId: response.body.id };
          } else if (response.status === 302) {
            console.warn('Location found, but redirected:', response);
            return { locationFound: true, locationId: response.headers.get('Location') };
          } else {
            return { locationFound: false, locationId: null };
          }
        }),
        catchError(this.handleError)
      );
  }


  getLocationById(id: number): Observable<any> {
    const url = `${this.locationURL}/retrieve/${id}`;
    return this.http.get<Location>(url).pipe(
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