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
 

  constructor(private http: HttpClient) {

  }

  getPersons(): Observable<any> {
    return this.http.get(`${this.base}/api/person/retrieve/all`).pipe(
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

  postLocation(zipCode: number, data: ILocation): Observable<any> {
    const url = `${this.locationURL}${zipCode}`;
    return this.http.post(url, data, this.options ).pipe(
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
            return { personFound: true, personId: response.headers.get('Location') };
          } else {
            return { personFound: false, personId: null };
          }
        }),
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

  getPersonById(id: number): Observable<IPerson> {
    const url = `${this.personURL}/retrieve/${id}`;
    return this.http.get<IPerson>(url).pipe(
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


  // register(data: IPolice): Observable<any> {
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       // 'Content-Type': 'text/pain',
  //     })
  //   };

  //   return this.http.post<any>(this.apiUrl, data, httpOptions)
  //     .pipe(
  //       catchError(this.handleError)
  //     );
  // }

  // // Function to get the list of ranks
  // getRanks(): Observable<IRank[]> {
  //   return this.http.get<IRank[]>(this.ranksApiUrl)
  //     .pipe(
  //       catchError(this.handleError)
  //     );
  // }

  // // Upload profile picture
  // // uploadPicture(file: FormData): Observable<IPictureUploadResponse> {
  // //   return this.http.post<IPictureUploadResponse>(this.pictureUploadUrl, file).pipe(
  // //     tap(response => console.log('Picture upload response:', response)),
  // //     catchError(this.handleError)
  // //   );
  // // }

  // // Save police data
  // savePoliceData(policeData: IPolice): Observable<any> {
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json'
  //     })
  //   };

  //   return this.http.post(this.apiUrl, policeData, httpOptions).pipe(
  //     tap(response => console.log('Save police response:', response)),
  //     catchError(this.handleError)
  //   );
  // }

  // // Update police data
  // updatePoliceData(id: number, policeData: IPolice): Observable<any> {
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json'
  //     })
  //   };

  //   return this.http.put(`${this.apiUrl}/${id}`, policeData, httpOptions).pipe(
  //     tap(response => console.log(`Update police ${id} response:`, response)),
  //     catchError(this.handleError)
  //   );
  // }

  // // Get all police data
  // getAllPoliceData(): Observable<IPolice[]> {
  //   return this.http.get<IPolice[]>(this.apiUrl).pipe(
  //     tap(response => console.log('Get all police response:', response)),
  //     catchError(this.handleError)
  //   );
  // }

  // // Delete police data
  // deletePolice(id: number): Observable<any> {
  //   return this.http.delete(`${this.apiUrl}/${id}`).pipe(
  //     tap(response => console.log(`Delete police ${id} response:`, response)),
  //     catchError(this.handleError)
  //   );
  // }

  // // Get police by ID
  // getPoliceById(id: number): Observable<IPolice> {
  //   return this.http.get<IPolice>(`${this.apiUrl}/${id}`).pipe(
  //     tap(response => console.log(`Get police ${id} response:`, response)),
  //     catchError(this.handleError)
  //   );
  // }

  // // Error handling function
  // private handleError(error: HttpErrorResponse) {
  //   let errorMessage = 'An unknown error occurred!';
  //   if (error.error instanceof ErrorEvent) {
  //     // Client-side or network error
  //     errorMessage = `Error: ${error.error.message}`;
  //   } else {
  //     // Backend returned an unsuccessful response code
  //     errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
  //   }
  //   console.error(errorMessage);
  //   return throwError(errorMessage);
  // }
}