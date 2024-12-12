import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { catchError, map, Observable, tap, throwError } from 'rxjs';

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
  // role: string;
  profilePic?: string;
  // rankId?: number;
  // stationId?: number;
  // unit: string;
  // badgeNumber: number;
  // debutDate: string;
  // createdBy: string;
  // pfpId?: number;
  // datetimeCreated: string;
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

export interface IRank {
  rank_id: number;
  rank_abbr: string;
  rank_full: string;
}


// export interface ICitizen {
//   citizen_id: number;
//   person_id: string;
//   is_certified: boolean;
//   firstname : string;
//   middlename: string;
//   lastname: string;
//   sex: string;
//   birthdate: string;
//   civil_status: string;
//   bio_status: string;
// }


export interface IPolice {
  // unit: string;
  // role: string;
  // badgeNumber: number;
  // debutDate: string;
  // stationId?: number;
  // personID?: number;
  // pfpId?: number;
  // // rankID?: number;
  // rankId?: number;
  // createdBy: string;
  // datetimeCreated: string;

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

@Injectable({
  providedIn: 'root',
})
export class PoliceAccountsService {
  private stationURL = 'https://localhost:7108/api/jurisdiction;'
  private accountURL = 'https://localhost:7108/api/account/signup';
  private personURL = 'https://localhost:7108/api/person';
  private locationURL = 'https://localhost:7108/api/location/create/';
  private ranksApiUrl = 'https://localhost:7108/api/police/load/ranks';
  private apiUrl = 'https://localhost:7108/api/police';
  private base = 'https://localhost';
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  // private headers = new HttpHeaders({ 'Content-Type': 'multipart/form-data' });

  constructor(private http: HttpClient) {}

  create(policeData: IPolice): Observable<any> {
    return this.http.post(this.apiUrl, policeData, { headers: this.headers }).pipe(catchError(this.handleError));
  }

  getPersons(): Observable<any> {
    return this.http.get(`${this.base}/api/person/retrieve/all`).pipe(catchError(this.handleError));
  }

  postAccount(data: IAccount): Observable<any> {
    return this.http.post(this.accountURL, data).pipe(catchError(this.handleError));
  }

  postPerson(data: IPerson): Observable<any> {
    return this.http.post(this.personURL, data).pipe(catchError(this.handleError));
  }

  postLocation(zipCode: number, data: ILocation): Observable<any> {
    const url = `${this.locationURL}${zipCode}`;
    return this.http.post(url, data, { headers: this.headers }).pipe(catchError(this.handleError));
  }

  createOrRetrievePerson(personData: IPerson): Observable<any> {
    return this.http.post(this.personURL, personData, { observe: 'response' }).pipe(
      map((response: HttpResponse<any>) => {
        if (response.status === 200) {
          return { personFound: true, personId: response.body.id };
        } else if (response.status === 302) {
          return { personFound: true, personId: response.headers.get('Location') };
        } else {
          return { personFound: false, personId: null };
        }
      }),
      catchError(this.handleError)
    );
  }

  createOrRetrieveLocation(locationData: ILocation, zipCode: number): Observable<any> {
    return this.http.post(`${this.locationURL}${zipCode}`, locationData, { observe: 'response' }).pipe(
      map((response: HttpResponse<any>) => {
        if (response.status === 200) {
          return { locationFound: true, locationId: response.body.id };
        } else if (response.status === 302) {
          return { locationFound: true, locationId: response.headers.get('Location') };
        } else {
          return { locationFound: false, locationId: null };
        }
      }),
      catchError(this.handleError)
    );
  }

  createOrRetrieveAccount(accountData: IAccount, email: string): Observable<any> {
    return this.http.post(`${this.accountURL}${email}`, accountData, { observe: 'response' }).pipe(
      map((response: HttpResponse<any>) => {
        if (response.status === 200) {
          return { accountFound: true, accountId: response.body.id };
        } else if (response.status === 302) {
          return { accountFound: true, accountId: response.headers.get('Account') };
        } else {
          return { accountFound: false, accountId: null };
        }
      }),
      catchError(this.handleError)
    );
  }

  getPersonById(id: number): Observable<IPerson> {
    const url = `${this.personURL}/retrieve/${id}`;
    return this.http.get<IPerson>(url).pipe(catchError(this.handleError));
  }

  getLocationById(id: number): Observable<any> {
    const url = `${this.locationURL}/retrieve/${id}`;
    return this.http.get<Location>(url).pipe(catchError(this.handleError));
  }

  register(data: IPolice): Observable<any> {
    return this.http.post<any>(this.apiUrl, data, { headers: this.headers }).pipe(catchError(this.handleError));
  }

  getRanks(): Observable<IRank[]> {
    return this.http.get<IRank[]>(this.ranksApiUrl).pipe(catchError(this.handleError));
  }

  savePoliceData(policeData: IPolice): Observable<any> {
    return this.http.post(this.apiUrl, policeData, { headers: this.headers }).pipe(
      tap(response => console.log('Save police response:', response)),
      catchError(this.handleError)
    );
  }

  updatePoliceData(id: number, policeData: IPolice): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, policeData, { headers: this.headers }).pipe(
      tap(response => console.log(`Update police ${id} response:`, response)),
      catchError(this.handleError)
    );
  }

  getAllPoliceData(): Observable<IPolice[]> {
    return this.http.get<IPolice[]>(this.apiUrl).pipe(
      tap(response => console.log('Get all police response:', response)),
      catchError(this.handleError)
    );
  }

  deletePolice(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap(response => console.log(`Delete police ${id} response:`, response)),
      catchError(this.handleError)
    );
  }

  getPoliceById(id: number): Observable<IPolice> {
    return this.http.get<IPolice>(`${this.apiUrl}/${id}`).pipe(
      tap(response => console.log(`Get police ${id} response:`, response)),
      catchError(this.handleError)
    );
  }

  saveStationData(stationData: any): Observable<any> {
    return this.http.post(this.stationURL, stationData).pipe(
      tap(response => console.log('Save station response:', response)),
      catchError(this.handleError)
    );
  }

  getAllStations(): Observable<any[]> {
    return this.http.get<any[]>(this.stationURL).pipe(
      tap(response => console.log('Get all stations response:', response)),
      catchError(this.handleError)
    );
  }

  getStationById(id: number): Observable<any> {
    return this.http.get<any>(`${this.stationURL}/${id}`).pipe(
      tap(response => console.log(`Get station ${id} response:`, response)),
      catchError(this.handleError)
    );
  }

  updateStationData(id: number, stationData: any): Observable<any> {
    return this.http.put(`${this.stationURL}/${id}`, stationData).pipe(
      tap(response => console.log(`Update station ${id} response:`, response)),
      catchError(this.handleError)
    );
  }

  deleteStation(id: number): Observable<any> {
    return this.http.delete(`${this.stationURL}/${id}`).pipe(
      tap(response => console.log(`Delete station ${id} response:`, response)),
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
