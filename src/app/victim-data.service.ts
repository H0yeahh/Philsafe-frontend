import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VictimDataService {

  private apiUrl = 'https://your-api-url.com/victims';

  constructor(private http: HttpClient) { }

  submitVictimData(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }
}
