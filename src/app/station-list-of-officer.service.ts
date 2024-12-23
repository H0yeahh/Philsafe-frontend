// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class StationListOfOfficerService {

//   constructor() { }
// }

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// import { Officer } from './officer.model'; // Import the Officer model

@Injectable({
  providedIn: 'root'
})
export class StationListOfOfficersService {
  // private apiUrl = 'http://your-api-url.com/officers'; // Replace with your API URL

  // constructor(private http: HttpClient) {}

  // getOfficers(): Observable<Officer[]> {
  //   return this.http.get<Officer[]>(this.apiUrl);
  // }

  // deleteOfficer(officerId: number): Observable<any> {
  //   return this.http.delete(`${this.apiUrl}/${officerId}`);
  // }

  // archiveOfficer(officerId: number): Observable<any> {
  //   return this.http.post(`${this.apiUrl}/${officerId}/archive`, {});
  // }
}