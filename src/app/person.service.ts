import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from './environment';

export interface IPolice {
  unit: string;
  role: string;
  badgeNumber: string;
  debutDate: string;
  stationID?: number;
  personID?: number;
  pfpId?: number;
  rankID?: number;
  createdBy: string;
  datetimeCreated: string;
}

export interface IAccount {
  firstname: string;
  middlename: string;
  lastname: string;
  sex: string;
  birthdate: string;
  civilStatus: string;
  bioStatus: boolean;
  email: string;
  telNum?: string;
  password: string;
  contactNum: string;
  homeAddressId: number;
  workAddressId: number;
  personId: number;
  role: string;
  profilePic?: string;
}

export interface IPerson {
  person_id?: number; 
  firstname: string;
  middlename: string;
  lastname: string;
  sex: string;
  birthdate: string;
  civilStatus: string;
  bioStatus: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class PersonService {
  private apiUrl = `${environment.ipAddUrl}api`;
  private accountUrl = `${this.apiUrl}/account/signup/upgrade`;
  private personUrl = `${this.apiUrl}/person`;
  private policeUrl = `${this.apiUrl}/police`;
  private locationUrl = `${this.apiUrl}/location/retrieve/all`;

  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  private mediaHeaders = new HttpHeaders({
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    // Add any other headers as needed
  });

  constructor(private http: HttpClient) {}

  create(policeData: IPolice): Observable<any> {
    return this.http
      .post(this.policeUrl, policeData, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  getPersons(): Observable<any> {
    return this.http
      .get<any>(`${this.personUrl}/retrieve/all`)
      .pipe(catchError(this.handleError));
  }


  getEvidences(reportId: number): Observable<any> {
    return this.http
      .get<any>(`${this.apiUrl}/media/collect/items/${reportId}`,
       { headers: this.mediaHeaders }  
      )
      .pipe(catchError(this.handleError));
  }


  getLocations(): Observable<any> {
    return this.http
      .get<any>(this.locationUrl)
      .pipe(catchError(this.handleError));
  }


  getALocation(locationId: number): Observable<any> {
    return this.http
      .get<any>(`${this.apiUrl}/location/retrieve/${locationId}`)
      .pipe(catchError(this.handleError));
  }

  postAccount(data: IAccount): Observable<any> {
    return this.http
      .post(this.accountUrl, data, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  postPerson(data: IPerson): Observable<any> {
    return this.http
      .post(this.personUrl, data, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  createOrRetrievePolice(policeData: IPolice): Observable<any> {
    return this.http
      .post(this.policeUrl, policeData, { headers: this.headers, observe: 'response' })
      .pipe(
        map((response: HttpResponse<any>) => {
          if (response.status === 200 && response.body && response.body.id) {
            return { personFound: true, personId: response.body.id };
          } else {
            return { personFound: false, personId: null };
          }
        }),
        catchError(this.handleError)
      );
  }

  registerPolice(policeData: IPolice): Observable<any> {
    return this.http
      .post(this.policeUrl, policeData, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  getPersonById(id: number): Observable<IPerson> {
    return this.http
      .get<IPerson>(`${this.personUrl}/retrieve/${id}`)
      .pipe(catchError(this.handleError));
  }

  getLocationById(id: number): Observable<any> {
    return this.http
      .get(`${this.locationUrl}/retrieve/${id}`)
      .pipe(catchError(this.handleError));
  }

  getAll() {
    return this.http
      .get(`${this.personUrl}/retrieve/all`)
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
