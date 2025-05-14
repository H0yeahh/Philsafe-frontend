import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { environment } from './environment';
// import { IPictureUploadResponse, IPolice, IRank } from './police-register.service';

// interface LocationResult{
//   message:string;
//   code: string;
//   id:number;
// }

// interface PersonResult{
//   message:string;
//   code: string;
//   id:number;
// }


// Define interfaces for better type safety
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

export interface ILocation {
  region: string;
  province: string;
  municipality: string; 
  barangay: string;
  street: string;
  blockLotUnit: string;
  zipCode: number;
}

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  // private accountURL = 'https://localhost:7108/api/account/signup';
  // private accountURL = 'https://localhost:7108/api/account/signup';
  // private personURL = 'https://localhost:7108/api/person';
  // private locationURL = 'https://localhost:7108/api/location/create/';
  // private ranksApiUrl = 'https://localhost:7108/api/police/load/ranks';
  // private apiUrl = 'https://localhost:7108/api/police';
  //private base = 'https://localhost';
  private options = {headers: new HttpHeaders({responseType: "json"})} 
  // private options = {
  //   headers: new HttpHeaders({
  //     'Content-Type': 'multipart/form-data'})
  //   };

 private base = `${environment.ipAddUrl}`;
 private accountURL = `${this.base}api/account/signup`;
 private personURL = `${this.base}api/person`;
 private locationURL = `${this.base}api/location/create`;
 private token = localStorage.getItem('token') ?? '';

  
  
  private auth_token = new HttpHeaders({
      'Authorization': this.token
  })
  private auth = new HttpHeaders({
    'Content-Type': 'application/json',
    
  });

  constructor(private http: HttpClient) {

  }

  getPersons(): Observable<any> {
    return this.http.get(`${this.base}/api/person/retrieve/all`, {headers: this.auth_token}).pipe(
      catchError(this.handleError)
    );
  }
  
  getAccount(): Observable<any> {
    
    return this.http.get<any>(`${this.base}api/account`, {headers: this.auth_token}).pipe(
      catchError(this.handleError)
    );
  }


  postAccount(data: IAccount): Observable<any> {
    return this.http.post(this.accountURL, data , {headers: this.auth_token}).pipe(
      catchError(this.handleError)
    );
  }
  
  postPerson(data: IPerson): Observable<any> {
    return this.http.post(this.personURL, data, {headers: this.auth_token}).pipe(
      catchError(this.handleError)
    );
  }

  postLocation(zipCode: number, data: ILocation): Observable<any> {
    const url = `${this.locationURL}${zipCode}`;
    return this.http.post(url, data, {responseType: 'json', headers: this.auth_token } ).pipe(
      catchError(this.handleError)
    );
  }

  createOrRetrievePerson(personData: IPerson): Observable<any> {
    return this.http.post(this.personURL, personData, { observe: 'response', headers: this.auth_token })
      .pipe(
        map((response: HttpResponse<any>) => {
          if (response.status === 200) {
            return { personFound: true, personId: response.body.id }; 
          } else if (response.status === 302) {
            console.warn('Person found, but redirected:', response);
            return { personFound: true, personId: response.headers.get('Location') };
          } else {
            return { personFound: false, personId: null };
          }
        }),
        catchError(this.handleError)
      );
  }

  createOrRetrieveLocation(locationData: ILocation, zipCode: number): Observable<any> {
    return this.http.post(`${this.locationURL}${zipCode}`, locationData, { observe: 'response', headers: this.auth_token })
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

  getProfPic(accountId: number): Observable<Blob> {
    return this.http.get(`${this.base}api/account/get/profilepic/${accountId}`, { responseType: 'blob', headers: this.auth_token })
        .pipe(
            tap((response: any) => {
                console.log('Response from getProfPic:', response);
            }),
            catchError(error => {
                // console.error('Error fetching profile picture:', error);
                return throwError(error);
            })
        );
}

getMoreProfile(accountIds: number[]) {
  const headerr = new HttpHeaders({
    'Content-Type': 'application/json', 
     'Authorization': this.token
  })
  return this.http.post(`${this.base}api/account/get/profilepics`, accountIds,  { headers: headerr })
        .pipe(
            tap((response: any) => {
                console.log('Response from getProfPic:', response);
            }),
            catchError(error => {
               console.error('Error fetching profile picture:', error);
                return throwError(error);
            })
        );
}


  getPersonById(id: number): Observable<IPerson> {
    const url = `${this.personURL}/retrieve/${id}`;
    return this.http.get<IPerson>(url, {headers: this.auth_token}).pipe(
      catchError(this.handleError)
    );
  }

  getLocationById(id: number): Observable<any> {
    const url = `${this.base}api/location/retrieve/${id}`;
    return this.http.get<Location>(url, {headers: this.auth_token}).pipe(
      catchError(this.handleError)
    );
  }


  getAllLocation(){
    const url = `${this.base}api/location/retrieve/all`;
    return this.http.get<Location>(url, {headers: this.auth_token}).pipe(
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