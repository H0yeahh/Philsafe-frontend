import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';

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
  profilePic?: string
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

export interface IPolice {
  person_id?: number;
  firstname: string;
  middlename: string;
  lastname: string;
  sex: string;
  birthdate: string;
  civilStatus: string;
  bioStatus: boolean;
  unit: string;
  role: string;
  badgeNumber: number;
  debutDate: string;
  stationId: number;
  personId: number;
  pfpId: number;
  rankId: number;
  createdBy: string;
  datetimeCreated: string;
}


@Injectable({
  providedIn: 'root'
})
  export class AddPersonService {
    private accountURL = 'https://localhost:7108/api/account/signup';
    private personURL = 'https://localhost:7108/api/person';
    private locationURL = 'https://localhost:7108/api/location/create/';
    private base = 'https://localhost';
    private policeURL = 'https://localhost:7108/api/police/upgrade';
    private options = {
      headers: new HttpHeaders({
        'Content-Type': 'multipart/formdata'})
      };

    

    constructor(private http: HttpClient) {
    }

    getPersons(): Observable<any> {
      return this.http.get(`${this.base}/api/person/retrieve/all`).pipe(
        catchError(this.handleError)
      );
    }

    
    getPolice(): Observable<any> {
      return this.http.get(`${this.base}/api/police/upgrade`).pipe(
        catchError(this.handleError)
      );
    }

    postPolice(data: IPolice): Observable<any> {
      return this.http.post(this.accountURL, data).pipe(
        catchError(this.handleError)
      );
    }

    postAccount(data: IAccount): Observable<any> {
      return this.http.post(this.accountURL, data).pipe(
        catchError(this.handleError)
      );
    }
    
    postPerson(data: IPerson): Observable<any> {
      return this.http.post(this.personURL, data).pipe(
        catchError(this.handleError)
      );
    }

    createOrRetrievePerson(personData: IPerson): Observable<any> {
      return this.http.post(this.personURL, personData, { observe: 'response' })
        .pipe(
          map((response: HttpResponse<any>) => {
            if (response.status === 200) {
              return { personFound: true, personId: response.body.id }; 
            } else if (response.status === 302) {
              console.warn('Person found, but redirected:', response);
              return { personFound: true, personId: response.headers.get('Person') };
            } else {
              return { personFound: false, personId: null };
            }
          }),
          catchError(this.handleError)
        );
    }

    createOrRetrievePolice(policeData: IPolice): Observable<any> {
      return this.http.post(this.policeURL, policeData, { observe: 'response' })
        .pipe(
          map((response: HttpResponse<any>) => {
            if (response.status === 200) {
              return { policeFound: true, policeId: response.body.id }; 
            } else if (response.status === 302) {
              console.warn('Police found, but redirected:', response);
              return { policeFound: true, policeId: response.headers.get('Police') };
            } else {
              return { policeFound: false, policeId: null };
            }
          }),
          catchError(this.handleError)
        );
    }


    getPersonById(id: number): Observable<IPerson> {
      const url = `${this.personURL}/retrieve/${id}`;
      return this.http.get<IPerson>(url).pipe(
        catchError(this.handleError)
      );
    }

    getPoliceById(id: number): Observable<IPolice> {
      const url = `${this.policeURL}/retrieve/${id}`;
      return this.http.get<IPolice>(url).pipe(
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